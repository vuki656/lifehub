import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { ReminderEntity } from '../../../entities/reminder'
import { UserEntity } from '../../../entities/user'

import { CreateReminderInput } from './types/inputs'
import { CreateReminderPayload } from './types/payloads'

export const createReminderHandler = async (input: CreateReminderInput): Promise<CreateReminderPayload> => {
    const {
        title,
        description,
        startDate,
        endDate,
        username,
    } = input

    // Verify and get user
    const user = await getRepository(UserEntity).findOne({ where: { username } })
    if (!user) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Create reminder
    const reminderToCreate = new ReminderEntity()
    reminderToCreate.title = title
    reminderToCreate.description = description
    reminderToCreate.startDate = startDate
    reminderToCreate.endDate = endDate
    reminderToCreate.user = user

    // Try to save reminder
    const createdReminder = await getRepository(ReminderEntity)
    .save(reminderToCreate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { reminder: createdReminder }
}
