import { UserInputError } from 'apollo-server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getRepository } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'
import { UserEntity } from '../../../entities/user'

import { GetRemindersByDateInput } from './types/inputs/getRemindersByDate.input'
import { GetRemindersByDatePayload } from './types/payloads/getRemindersByDate.payload'

dayjs.extend(utc)

export const getRemindersByDateHandler = async (input: GetRemindersByDateInput): Promise<GetRemindersByDatePayload> => {
    const {
        username,
        date,
    } = input

    // Get and verify user
    const user = await getRepository(UserEntity).findOne({ where: { username } })
    if (!user) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Return empty set on overdue select by using a date in the past
    if (date === 'overdue') {
        query = {
            condition: { today: dayjs.utc(dayjs().subtract(200000, 'day')) },
            query: ':today = reminder.endDate',
        }
    }

    // Return all reminders that are after the last day in the days list
    if (date === 'upcoming') {
        const foundReminders = await getRepository(ReminderEntity)
        .createQueryBuilder('reminder')
        .where('reminder.endDate < :lastDayInList', { today: dayjs.utc(dayjs().add(200000, 'day')) })
        .andWhere('reminder.userId = :userId', { userId: user?.id })
        .getMany()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

        return { reminders: foundReminders }
    }

    // Return all reminders where selected date is between startDate and endDate
    const foundReminders = await getRepository(ReminderEntity)
    .createQueryBuilder('reminder')
    .where(':selectedDate BETWEEN reminder.startDate AND reminder.endDate', { selectedDate: date })
    .andWhere('reminder.userId = :userId', { userId: user?.id })
    .getMany()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { reminders: foundReminders }
}
