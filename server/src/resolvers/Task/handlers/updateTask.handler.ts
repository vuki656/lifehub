import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id, title, note, date } = input

    const taskToUpdate = await TaskEntity.findOne(id)

    // Throw error if no task
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    taskToUpdate.title = title
    taskToUpdate.note = note
    taskToUpdate.date = date

    // Try to save updated task
    return getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
