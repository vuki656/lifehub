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
        reminder.user = user
    } else {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    }

    // Generated reminder id
    let id

    // Try to save reminder
    await getRepository(ReminderEntity)
    .save(reminder)
    .then((_reminder) => {
        id = _reminder.id
    })
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { id, title, description, username, startDate, endDate }
}
