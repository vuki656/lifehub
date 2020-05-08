import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { RepeatingTaskInstanceEntity } from '../../../entities/repeatingTaskInstance'

export const updateRepeatingTaskInstanceHandler = async (input) => {
    const { id } = input

    const repeatingTaskInstanceToUpdate = await RepeatingTaskInstanceEntity.findOne(id)
    if (!repeatingTaskInstanceToUpdate) throw new UserInputError('Error', { error: 'Error' })

    Object.assign(repeatingTaskInstanceToUpdate, input)

    // Try to save updated repeating task instance
    return getRepository(RepeatingTaskInstanceEntity)
    .save(repeatingTaskInstanceToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
