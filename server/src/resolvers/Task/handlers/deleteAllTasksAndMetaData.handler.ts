import { UserInputError } from 'apollo-server'
import { getConnection, getManager } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

export const deleteAllTasksAndMetaDataHandler = async (input) => {
    const { taskMetaDataId } = input.input

    // Verify task meta data existence
    const taskMetaDataToDelete: TaskMetaDataEntity | undefined =
        await getConnection()
        .getRepository(TaskMetaDataEntity)
        .findOne(taskMetaDataId)
    if (!taskMetaDataToDelete) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Delete delete task meta data and its tasks
    await getManager()
    .transaction(async transactionalEntityManager => {
        await transactionalEntityManager.delete(TaskEntity, { taskMetaData: taskMetaDataId })
        await transactionalEntityManager.delete(TaskMetaDataEntity, { id: taskMetaDataId })
    })
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { taskMetaDataId }
}
