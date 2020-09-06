import { UserInputError } from 'apollo-server'
import dayjs from 'dayjs'
import { getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskCardEntity } from '../../../entities/taskCard'

export const getTasksByDateAndTaskCardHandler = async (input) => {
    const {
        selectedDate,
        taskCardId,
    } = input

    const dayBeforeDayRange = dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD')
    const dayAfterDayRange = dayjs().add(20, 'day').startOf('day').format('YYYY-MM-DD')
    const formattedSelectedDate = dayjs(selectedDate).format('YYYY-MM-DD')

    // Verify task card existence
    const foundTaskCard: TaskCardEntity | undefined = await getRepository(TaskCardEntity).findOne({ where: { id: taskCardId } })
    if (!foundTaskCard) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Get all tasks whose date is before today and not completed (overdue tasks)
    if (formattedSelectedDate === dayBeforeDayRange) {
        const foundOverdueTasks = await getRepository(TaskEntity)
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.taskMetaData', 'taskMetaData')
        .leftJoinAndSelect('taskMetaData.taskCard', 'taskCard')
        .andWhere('task.date < :selectedDate', { selectedDate: dayjs().toDate() })
        .andWhere('task.isCompleted = false')
        .andWhere('taskMetaData.taskCard = :taskCardId', { taskCardId })
        .getMany()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

        return { tasks: foundOverdueTasks }
    }

    // Get all tasks whose date is after 20 days from today and not completed (upcoming tasks)
    if (formattedSelectedDate === dayAfterDayRange) {
        const foundUpcomingTasks = await getRepository(TaskEntity)
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.taskMetaData', 'taskMetaData')
        .leftJoinAndSelect('taskMetaData.taskCard', 'taskCard')
        .where('task.date > :selectedDate', { selectedDate: dayjs.utc().add(20, 'day') })
        .andWhere('task.isCompleted = false')
        .andWhere('taskMetaData.taskCard = :taskCardId', { taskCardId })
        .getMany()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

        return { tasks: foundUpcomingTasks }
    }

    const foundTasks = await getRepository(TaskEntity)
    .createQueryBuilder('task')
    .leftJoinAndSelect('task.taskMetaData', 'taskMetaData')
    .leftJoinAndSelect('taskMetaData.taskCard', 'taskCard')
    .where('task.date = :taskDate', { taskDate: selectedDate })
    .andWhere('task.isCompleted = false')
    .andWhere('taskMetaData.taskCard = :taskCardId', { taskCardId })
    .getMany()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return { tasks: foundTasks }
}
