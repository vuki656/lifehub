import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'

export const deleteTaskHandler = async (input) => {
    const { id } = input

    // Try to delete task
    await getRepository(TaskEntity)
    .delete(id)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { id }
}
