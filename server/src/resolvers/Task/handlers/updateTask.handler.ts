import { UserInputError } from 'apollo-server'
import dayjs from 'dayjs'
// eslint-disable-next-line import/default
import utc from 'dayjs/plugin/utc'
import _ from 'lodash'
import {
    RRule,
    RRuleSet,
    rrulestr,
} from 'rrule'
import {
    getConnection,
    getRepository,
} from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskCardEntity } from '../../../entities/taskCard'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

dayjs.extend(utc)

// If end date after maxDateRangeEndDate return maxDateRangeEndDate, else return current end date
const getEndDate = (currentEndDate: Date, maxDateRangeEndDate: Date) => {
    return !currentEndDate || dayjs(currentEndDate).isAfter(maxDateRangeEndDate)
        ? maxDateRangeEndDate
        : currentEndDate
}

// Get existing task instances and remove all existing from the given list
const removeExistingTasks = async (taskInstanceToCreateDates: Date[], updatedTask: TaskEntity, maxDateRangeEndDate: Date) => {
    // Get existing task dates
    const existingTasks = await
    getRepository(TaskEntity)
    .createQueryBuilder('task')
    .select(['task.date'])
    .where('task.taskMetaData = :taskMetaDataId', { taskMetaDataId: updatedTask.taskMetaData.id })
    .andWhere('task.date >= :startDate', { startDate: updatedTask.taskMetaData.startDate })
    .andWhere('task.date <= :endDate', { endDate: updatedTask.taskMetaData.endDate || maxDateRangeEndDate })
    .getMany()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    // Remove all taskInstanceToCreateDates that already exist
    existingTasks.forEach((existingTaskInstance) => {
        _.remove(taskInstanceToCreateDates, (taskInstanceToCreateDate) => {
            return dayjs(taskInstanceToCreateDate).isSame(existingTaskInstance.date, 'date')
        })
    })

    return taskInstanceToCreateDates
}

// Delete all instances from database that dont match the rrule filter
const deleteAllInstancesNotMatchingFilter = async (rruleObj: RRule, taskMetaData: TaskMetaDataEntity, maxDateRangeEndDate: Date) => {
    const {
        startDate,
        endDate,
        id: taskMetaDataId,
    } = taskMetaData

    // Dates that match rrule filter
    const datesMatchingFilter: Date[] = rruleObj.between(
        dayjs(startDate!).toDate(),
        dayjs(endDate || maxDateRangeEndDate).toDate(),
        true,
    )

    if (!_.isEmpty(datesMatchingFilter)) {
        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(TaskEntity)
        .where('taskMetaData = :taskMetaDataId', { taskMetaDataId })
        .andWhere('date NOT IN (:...datesMatchingFilter)', { datesMatchingFilter })
        .execute()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }
}

const createRepeatingInstances = async (taskCardId: string, updatedTask: TaskEntity) => {
    const { taskMetaData } = updatedTask
    const {
        startDate,
        endDate,
        rrule,
    } = taskMetaData

    const maxDateRangeEndDate: Date = dayjs.utc(dayjs().add(20, 'day')).startOf('day').toDate()
    const rruleObj: RRule | RRuleSet = rrulestr(rrule!)
    const updatedEndDate: Date = getEndDate(endDate!, maxDateRangeEndDate)
    const nextRepeatingInstance = rruleObj.after(updatedEndDate)

    // Get repeating instance dates
    let taskInstanceToCreateDates: Date[] = rruleObj.between(
        dayjs(startDate!).toDate(),
        dayjs(updatedEndDate).toDate(),
        true,
    )

    taskInstanceToCreateDates = await removeExistingTasks(taskInstanceToCreateDates, updatedTask, maxDateRangeEndDate)
    await deleteAllInstancesNotMatchingFilter(rruleObj, taskMetaData, maxDateRangeEndDate)

    // Get and verify task card
    const tasksTaskCard: TaskCardEntity | undefined = await getConnection().getRepository(TaskCardEntity).findOne(taskCardId)
    if (!tasksTaskCard) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    taskMetaData.nextRepeatingInstance = nextRepeatingInstance

    // Create task instances from toBeCreated list
    const taskEntitiesToCreate = taskInstanceToCreateDates.map((repeatingTaskDateInstanceDate) => {
        const taskEntity = new TaskEntity()

        taskEntity.date = repeatingTaskDateInstanceDate
        taskEntity.taskMetaData = taskMetaData

        return taskEntity
    })

    // If no tasks to create, update only meta data, else create tasks and update meta data
    if (_.isEmpty(taskEntitiesToCreate)) {
        await getRepository(TaskMetaDataEntity)
        .save(taskMetaData)
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    } else {
        await getRepository(TaskEntity)
        .save(taskEntitiesToCreate)
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }
}

export const updateTaskHandler = async (input) => {
    const { taskMetaData } = input.input

    if (taskMetaData.isRepeating) {
        await createRepeatingInstances(taskMetaData.taskCardId, input.input)
    } else {
        const taskEntity: TaskEntity = input.input
        taskEntity.taskMetaData.taskCard.id = input.input.taskCard.id

        await getRepository(TaskEntity)
        .save(input.input)
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }

    return { task: input.input }
}
