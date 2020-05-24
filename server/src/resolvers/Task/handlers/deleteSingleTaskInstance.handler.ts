import { UserInputError } from 'apollo-server'
import { getConnection, getManager } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

export const deleteSingleTaskInstanceHandler = async (input) => {
    const { taskId, taskMetaDataId, rruleStr } = input.input

    // Verify task existence
    const taskToDelete: TaskEntity | undefined =
        await getConnection()
        .getRepository(TaskEntity)
        .findOne(taskId)
    if (!taskToDelete) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Verify task meta data existence
    const taskMetaDataToUpdate: TaskMetaDataEntity | undefined =
        await getConnection()
        .getRepository(TaskMetaDataEntity)
        .findOne(taskMetaDataId)
    if (!taskMetaDataToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    taskMetaDataToUpdate.rrule = rruleStr

    // Delete delete task and update meta data rrule string
    await getManager()
    .transaction(async transactionalEntityManager => {
        await transactionalEntityManager.delete(
            TaskEntity,
            { id: taskId },
        )
        await transactionalEntityManager.update(
            TaskMetaDataEntity,
            { id: taskMetaDataId },
            { rrule: rruleStr },
        )
    })
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { taskId }
}
