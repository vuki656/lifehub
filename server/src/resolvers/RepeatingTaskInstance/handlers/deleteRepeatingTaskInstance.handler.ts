import { UserInputError } from 'apollo-server'
import { getConnection } from 'typeorm'

import { RepeatingTaskInstanceEntity } from '../../../entities/repeatingTaskInstance'
import { TaskEntity } from '../../../entities/task'

export const deleteRepeatingTaskInstanceHandler = async (input) => {
    const { repeatingTaskInstanceId, taskId, rruleStrWithUpdatedExclusions } = input

    const repeatingTaskInstanceToDelete = await RepeatingTaskInstanceEntity.findOne(repeatingTaskInstanceId)
    if (!repeatingTaskInstanceToDelete) throw new UserInputError('Error', { error: 'Error' })

    const taskToUpdate = await TaskEntity.findOne(taskId)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Error' })

    // Update root task rrule and delete repeating instance transaction
    await getConnection().transaction(async transactionalEntityManager => {

        // Update task rrule
        await transactionalEntityManager
        .update(
            TaskEntity,
            { id: taskId },
            { rrule: rruleStrWithUpdatedExclusions },
        )
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

        // Delete repeating task instance
        await transactionalEntityManager
        .delete(RepeatingTaskInstanceEntity, { id: repeatingTaskInstanceId })
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    })

    return repeatingTaskInstanceToDelete
}
