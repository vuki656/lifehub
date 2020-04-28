import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'

export const updateReminderHandler = async (input) => {
    const { id, title, description, startDate, endDate } = input

    // Create reminder
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

    // Generated reminder id
    let updatedReminder

    // Try to save updated reminder
    await getRepository(ReminderEntity)
    .save(reminderToUpdate)
    .then((savedReminder) => {
        updatedReminder = savedReminder
    })
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { ...updatedReminder }
}
