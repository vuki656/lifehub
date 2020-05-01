import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'

export const updateReminderHandler = async (input) => {
    const { id, title, description, startDate, endDate } = input

    // Get reminder
    const reminderToUpdate = await ReminderEntity.findOne(id)

    // Try to update the found reminder
    if (reminderToUpdate) {
        reminderToUpdate.title = title
        reminderToUpdate.description = description
        reminderToUpdate.startDate = startDate
        reminderToUpdate.endDate = endDate
    } else {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    }

    // Try to save updated reminder
    return getRepository(ReminderEntity)
    .save(reminderToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
