import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskCardEntity } from '../../../entities/taskCard'
import { UserEntity } from '../../../entities/user'

export const createTaskCardHandler = async (input) => {
    const { username, name } = input

    // Get user
    const user = await getRepository(UserEntity).findOne({ where: { username } })

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
