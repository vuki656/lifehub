import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'
import { TaskCardEntity } from '../../../entities/taskCard'
import { UserEntity } from '../../../entities/user'

export const getAllTaskCardsHandler = async (input) => {
    const { username } = input

    // Get user
    const user = await getRepository(UserEntity).findOne({ where: { username } })

    // Throw error if no user
    if (!user) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Try to save updated reminder
    return getRepository(TaskCardEntity)
    .find({ where: { userId: user.id } })
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
