import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskCardEntity } from '../../../entities/taskCard'
import { UserEntity } from '../../../entities/user'

export const createTaskCardHandler = async (input) => {
    const {
        username,
        name,
    } = input

    const user = await getRepository(UserEntity).findOne({ where: { username } })
    const existingTaskCard = await getRepository(TaskCardEntity).findOne({ where: { name } })

    // Throw error if name not unique
    if (existingTaskCard) throw new UserInputError('Error', { error: 'Name already exists.' })

    // Throw error if no user
    if (!user) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Save task
    const taskCard = new TaskCardEntity()
    taskCard.name = name
    taskCard.userId = user

    return getRepository(TaskCardEntity)
    .save(taskCard)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
