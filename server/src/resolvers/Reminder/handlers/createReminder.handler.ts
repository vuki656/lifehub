import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'
import { UserEntity } from '../../../entities/user'

export const createReminderHandler = async (input) => {
    const { username, title, description, startDate, endDate } = input

    // Get user
    const user = await getRepository(UserEntity).findOne({ where: { username } })

    // Create reminder
    const reminder = new ReminderEntity()
    reminder.title = title
    reminder.description = description
    reminder.startDate = startDate
    reminder.endDate = endDate

    // Try to assign the user
    if (user) {
        reminder.userId = user
    } else {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    }

    // Try to save reminder
    return getRepository(ReminderEntity)
    .save(reminder)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
