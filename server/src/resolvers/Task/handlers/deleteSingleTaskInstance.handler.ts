import { UserInputError } from 'apollo-server'
import {
    getConnection,
    getManager,
} from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

export const deleteSingleTaskInstanceHandler = async (input) => {
    const {
        taskId,
        taskMetaDataId,
        rruleStr,
    } = input.input

    const taskCount: number = await getConnection().getRepository(TaskEntity).count()

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

    // Delete single task instance and update meta data rrule string
    await getManager()
    .transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.delete(
            TaskEntity,
            { id: taskId },
        )

        // If last task instance being deleted, delete its meta data as well
        if (taskCount === 1) {
            await transactionalEntityManager.delete(
                TaskMetaDataEntity,
                { id: taskMetaDataId },
            )
        } else {
            await transactionalEntityManager.update(
                TaskMetaDataEntity,
                { id: taskMetaDataId },
                { rrule: rruleStr },
            )
        }
    })
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { taskId }
}
