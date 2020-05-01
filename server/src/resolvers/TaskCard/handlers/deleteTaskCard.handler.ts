import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskCardEntity } from '../../../entities/taskCard'

export const deleteTaskCardHandler = async (input) => {
    const { id } = input

    // Try to delete taskCard
    getRepository(TaskCardEntity)
    .delete(id)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { id }
}
