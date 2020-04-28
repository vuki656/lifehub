import { getRepository, LessThan, MoreThan } from 'typeorm'

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
            endDate: MoreThan(selectedDate),
            startDate: LessThan(selectedDate),
        },
    })
}
