import { UserInputError } from 'apollo-server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getRepository } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'
import { UserEntity } from '../../../entities/user'
import { ReminderQueryType } from '../reminder.types'

dayjs.extend(utc)
export const getRemindersByDateHandler = async (input) => {
    const { username, selectedDate } = input

    // Get user
    const user = await getRepository(UserEntity).findOne({ where: { username } })
    let query: ReminderQueryType = {
        query: `:selectedDate BETWEEN reminder.startDate AND reminder.endDate`,
        condition: { selectedDate },
    }

    // Throw error if no user
    if (!user) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Return empty set on overdue select by using a date in the past
    if (selectedDate === 'overdue') {
        query = {
            query: `:today = reminder.endDate`,
            condition: { today: dayjs.utc(dayjs().subtract(200000, 'day')) },
        }
    }

    // Return all reminders that are after the last day in the days list
    if (selectedDate === 'upcoming') {
        query = {
            query: `:lastDayInList < reminder.endDate`,
            condition: { today: dayjs.utc(dayjs().add(200000, 'day')) },
        }
    }

    // Return all reminders where selected date is between startDate and endDate
    return getRepository(ReminderEntity)
    .createQueryBuilder('reminder')
    .where(query.query, query.condition)
    .andWhere(`reminder.userId = :userId`, { userId: user?.id })
    .getMany()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
