import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'
import { TaskCardEntity } from '../../../entities/taskCard'

export const updateTaskCardHandler = async (input) => {
    const { id, name } = input

    // Get task card
    const taskCardToUpdate = await TaskCardEntity.findOne(id)
    const taskCardWithSameName = await getRepository(TaskCardEntity).findOne({ where: { name } })
    if (taskCardWithSameName || !taskCardToUpdate) throw new UserInputError('Error', { error: 'Name already exists.' })

    Object.assign(taskCardToUpdate, input)

    // Try to save updated task card
    return getRepository(TaskCardEntity)
    .save(taskCardToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
