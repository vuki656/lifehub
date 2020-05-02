import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id, title, note, date } = input

    const taskToUpdate = await TaskEntity.findOne(id)

    // Try to update the task
    if (taskToUpdate) {
        taskToUpdate.title = title
        taskToUpdate.note = note
        taskToUpdate.date = date
    } else {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    }

    // Try to save updated task
    return getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
