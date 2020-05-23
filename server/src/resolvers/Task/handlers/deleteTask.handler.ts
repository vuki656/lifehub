import { UserInputError } from 'apollo-server'
import { getConnection, getManager } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

export const deleteTaskHandler = async (input) => {
    const { taskId, taskMetaDataId } = input.input

    // Verify task existence
    const taskToDelete: TaskEntity | undefined =
        await getConnection()
        .getRepository(TaskEntity)
        .findOne(taskId)
    if (!taskToDelete) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Verify task meta data existence
    const taskMetaDataToDelete: TaskMetaDataEntity | undefined =
        await getConnection()
        .getRepository(TaskMetaDataEntity)
        .findOne(taskMetaDataId)
    if (!taskMetaDataToDelete) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Delete both task and task meta data
    await getManager()
    .transaction(async transactionalEntityManager => {
        await transactionalEntityManager.delete(TaskEntity, { id: taskId })
        await transactionalEntityManager.delete(TaskMetaDataEntity, { id: taskMetaDataId })
    })
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { taskId }
}
