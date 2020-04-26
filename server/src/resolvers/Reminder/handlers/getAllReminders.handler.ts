import { getRepository } from 'typeorm'
import { ReminderEntity } from '../../../entities/reminder'

export const getAllRemindersHandler = () => {
    return getRepository(ReminderEntity).find()
}
