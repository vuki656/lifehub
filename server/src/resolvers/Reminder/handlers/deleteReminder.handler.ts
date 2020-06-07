import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'

export const deleteReminderHandler = async (input) => {
    const { id } = input

    // Try to delete reminder
    await getRepository(ReminderEntity)
    .delete(id)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { id }
}
