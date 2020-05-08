import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'

export const updateReminderHandler = async (input) => {
    const { id } = input

    // Get reminder
    const reminderToUpdate = await ReminderEntity.findOne(id)
    if (!reminderToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    Object.assign(reminderToUpdate, input)

    // Try to save updated reminder
    return getRepository(ReminderEntity)
    .save(reminderToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
