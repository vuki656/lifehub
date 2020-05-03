import { UserInputError } from 'apollo-server'
import moment from 'moment'
import { getRepository } from 'typeorm'
import { TaskEntity } from '../../../entities/task'
import { TaskCardEntity } from '../../../entities/taskCard'

export const getTasksByDateAndTaskCardHandler = async (input) => {
    const { selectedDate, taskCardId } = input

    // Check if card exists
    if (!await getRepository(TaskCardEntity).findOne({ where: { id: taskCardId } })) {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    }

    // Get all tasks older than today that are not done
    if (selectedDate === 'overdue') {
        return getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where(`task.taskCardId = :taskCardId`, { taskCardId })
        .andWhere(`task.date < :selectedDate`, { selectedDate: moment().utc() })
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
        .andWhere(`task.date > :selectedDate`, { selectedDate: moment().add(20, 'days').utc() })
        .getMany()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }

    // Return all tasks for selected task card and selected date
    return getRepository(TaskEntity)
    .createQueryBuilder('task')
    .where(`task.taskCardId = :taskCardId`, { taskCardId })
    .andWhere(`task.date = :selectedDate`, { selectedDate })
    .getMany()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
