import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'
import { TaskCardEntity } from '../../../entities/taskCard'

export const updateTaskCardHandler = async (input) => {
    const { id, name } = input

    // Get task card
    const taskCardToUpdate = await TaskCardEntity.findOne(id)
    const existingTaskCard = await getRepository(TaskCardEntity).findOne({ where: { name } })

    // Throw error if name not unique
    if (existingTaskCard) throw new UserInputError('Error', { error: 'Name already exists.' })

    // Try to update the found task card
    if (taskCardToUpdate) {
        taskCardToUpdate.name = name
    } else {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    }

    // Try to save updated task card
    return getRepository(TaskCardEntity)
    .save(taskCardToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
