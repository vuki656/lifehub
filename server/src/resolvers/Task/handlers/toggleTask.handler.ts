import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'

export const toggleTaskHandler = async (input) => {
    const { id, checked } = input

    const taskToUpdate = await TaskEntity.findOne(id)

    // Try to update the task checked status
    if (taskToUpdate) {
        taskToUpdate.checked = checked
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
