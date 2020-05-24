import { UserInputError } from 'apollo-server'
import dayjs from 'dayjs'
import { getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskCardEntity } from '../../../entities/taskCard'

export const getTasksByDateAndTaskCardHandler = async (input) => {
    const { selectedDate, taskCardId } = input.input

    // Check if card exists
    if (!await getRepository(TaskCardEntity).findOne({ where: { id: taskCardId } })) {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    }

    // Get all tasks older than today that are not done
    if (selectedDate === 'overdue') {
        return getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where(`task.taskCardId = :taskCardId`, { taskCardId })
        .andWhere(`task.date < :selectedDate`, { selectedDate: dayjs.utc().toDate() })
        .andWhere(`task.checked = :checked`, { checked: false })
        .getMany()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }

    // Get all tasks whose date is after 20 days
    if (selectedDate === 'upcoming') {
        return getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where(`task.taskCardId = :taskCardId`, { taskCardId })
        .andWhere(`task.date > :selectedDate`, { selectedDate: dayjs.utc().add(20, 'day') })
        .getMany()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }

    const foundTasks = await getRepository(TaskEntity)
    .createQueryBuilder('task')
    .leftJoinAndSelect('task.taskMetaData', 'taskMetaData')
    .where('task.date = :taskDate', { taskDate: selectedDate })
    .andWhere('task.taskCard = :taskCardId', { taskCardId })
    .getMany()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    console.log(foundTasks)

    return { tasks: foundTasks }
}
