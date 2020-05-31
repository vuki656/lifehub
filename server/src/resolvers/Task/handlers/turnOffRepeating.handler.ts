import { UserInputError } from 'apollo-server'
import { getManager } from 'typeorm'
import { TaskEntity } from '../../../entities/task'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

export const turnOffRepeatingHandler = async (input) => {
    const { taskId, taskMetaDataId } = input.input

    // Get and verify task meta data existence
    const taskMetaDataToUpdate = await TaskMetaDataEntity.findOne(taskMetaDataId)
    if (!taskMetaDataToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Get and verify task existence
    const taskToUpdate = await TaskEntity.findOne(taskId)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Clear task metadata repeating related info
    taskMetaDataToUpdate.rrule = null
    taskMetaDataToUpdate.startDate = null
    taskMetaDataToUpdate.endDate = null
    taskMetaDataToUpdate.nextRepeatingInstance = null
    taskMetaDataToUpdate.isRepeating = false
    taskMetaDataToUpdate.isHabit = false

    // Delete all tasks except current and delete task metadata related to repeating
    await getManager()
    .transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(TaskMetaDataEntity, taskMetaDataToUpdate)
        await transactionalEntityManager
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .delete()
        .from(TaskEntity)
        .where('taskMetaData = :taskMetaDataId', { taskMetaDataId })
        .andWhere('id != :taskId', { taskId })
        .execute()

    })
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
