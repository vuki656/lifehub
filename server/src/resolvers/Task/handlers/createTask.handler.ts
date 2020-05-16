import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskCardEntity } from '../../../entities/taskCard'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

export const createTaskHandler = async (input) => {
    const { title, taskCardId, taskMetaData } = input.input

    // Verify task card existence
    const foundTaskCard: TaskCardEntity | undefined = await getRepository(TaskCardEntity).findOne({ where: { id: taskCardId } })
    if (!foundTaskCard) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Create task meta data entity
    const taskMetaDataEntity = new TaskMetaDataEntity()
    taskMetaDataEntity.date = taskMetaData.date

    // Create task entity
    const taskEntity = new TaskEntity()
    taskEntity.title = title
    taskEntity.taskCard = foundTaskCard
    taskEntity.taskMetaData = taskMetaDataEntity

    // Save task entity
    const createdTask = await getRepository(TaskEntity)
    .save(taskEntity)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { task: createdTask }
}
