import moment from 'moment'
import { getRepository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'
import { UserEntity } from '../../../entities/user'

export const getRemindersByDateHandler = async (input) => {
    const { username, selectedDate } = input

    // Get user
    const user = await getRepository(UserEntity).findOne({ where: { username } })

    // Get users reminders that aren't in the past
    return getRepository(ReminderEntity).find({
        where: {
            userId: user?.id,
            endDate: MoreThanOrEqual(moment.utc(selectedDate)),
            startDate: LessThanOrEqual(moment.utc(selectedDate)),
        },
    })
}
