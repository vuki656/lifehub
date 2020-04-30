import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'
import { TaskEntity } from '../../../entities/task'

import { UserEntity } from '../../../entities/user'

export const createTaskHandler = async (input) => {
    const { username, title } = input

    // Get user
    const user = await getRepository(UserEntity).findOne({ where: { username } })

    // Throw error if no user
    if (!user) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Save task
    const task = new TaskEntity()
    task.title = title
    task.userId = user

    return getRepository(TaskEntity)
    .save(task)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
