import { UserInputError } from 'apollo-server'
import { getConnection, getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'

export const toggleTaskCompletedHandler = async (input) => {
    const { id } = input.input

    // Get task whose isCompleted state is being toggled
    const taskToUpdate = await getRepository(TaskEntity)
    .createQueryBuilder('task')
    .leftJoinAndSelect('task.taskMetaData', 'taskMetaData')
    .where('task.id = :taskId', { taskId: id })
    .getOne()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // TODO: check why updated task isn't returned
    // Change isCompleted state
    const updatedTask = await getConnection()
    .createQueryBuilder()
    .update(TaskEntity)
    .set({ isCompleted: !taskToUpdate.isCompleted })
    .where('id = :taskId', { taskId: id })
    .execute()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { task: taskToUpdate }
}
