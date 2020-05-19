import { UserInputError } from 'apollo-server'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import _ from 'lodash'
import { RRule, rrulestr } from 'rrule'
import { getConnection, getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskCardEntity } from '../../../entities/taskCard'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

dayjs.extend(utc)

export const updateTaskHandler = async (input) => {
    const { id, title, note, date, taskCardId, taskMetaData } = input.input

    // Verify existence and get task to update
    // const taskToUpdate: TaskEntity | undefined = await getConnection().getRepository(TaskEntity).findOne(id)
    // if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Generate task instances if its repeating
    if (taskMetaData.isRepeating) await createRepeatingInstances(taskCardId, input.input)

    // THIS PROB WONT WORK BCZ INPUT PARAMS
    // Object.assign(taskToUpdate, input)
}

const createRepeatingInstances = async (taskCardId: string, updatedTask: TaskEntity) => {
    const { taskMetaData } = updatedTask
    const { startDate, endDate, rrule } = taskMetaData

    const firstRepeatingInstanceDate: Date | undefined = await getEdgeTaskInstance(updatedTask, 'ASC')
    const lastRepeatingInstanceDate: Date | undefined = await getEdgeTaskInstance(updatedTask, 'DESC')
    const maxDateRangeEndDate: Dayjs = dayjs().add(20, 'day')
    const rruleObj = rrulestr(rrule)

    // SAME DATE IS NOT DISPLAYED THE SAME ON CLIENT AND SERVER
    // CLIENT DISPLAYS LOCAL TIME
    // SERVER DISPLAYS UTC, RRULE PARSES THE DATES IN UTC AND THE WEEKDAYS ARE WRONG
    // THEY SHOULD BE 1 DAY BEHIND AT 22 SO ITS PARSED CORRECTLY TO LOCAL TIMEZONE, BUT ARE INSTEAD THAT DAY AT 22 SO MON TUE AT 22, WHICH
    // RETURNS THE NEXT DAY IN LOCAL TIME

    rruleObj.all((date) => {
        console.log(date)
        return true
    })

    let nextRepeatingInstance: Date | null = null
    let taskInstanceToCreateDates: Date[] = []

    // If end date before max day span, generate all, set next repeating instance to null
    if (dayjs(startDate).isBefore(maxDateRangeEndDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
        )
        nextRepeatingInstance = null
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (dayjs(endDate).isAfter(maxDateRangeEndDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
    }

    // If new end date is after the old one, delete old instances, set the next repeating instance to the following one
    if (lastRepeatingInstanceDate && dayjs(endDate).isAfter(lastRepeatingInstanceDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(lastRepeatingInstanceDate).toDate(),
            maxDateRangeEndDate.toDate(), // If rrule has no end date or rrule end date > max, max wins, else rrule end date wins
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
    }

    // If new end date is before the old one, delete all instances after the new one
    if (lastRepeatingInstanceDate && dayjs(endDate).isBefore(lastRepeatingInstanceDate)) {
        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(TaskEntity)
        .where('taskMetaData = :taskMetaDataId', { taskMetaDataId: taskMetaData.id })
        .andWhere('date > :newEndDate', { newEndDate: endDate })
        .execute()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

        nextRepeatingInstance = null
    }

    // If first repeating instance exists, then we can do checks
    // If gap between first instance and start date
    // If gap start date after first instance
    if (firstRepeatingInstanceDate) {

        // If start date is before the first repeating instance, create difference
        if (dayjs(startDate).isBefore(firstRepeatingInstanceDate)) {
            taskInstanceToCreateDates = rruleObj.between(
                dayjs(startDate).toDate(),
                dayjs(firstRepeatingInstanceDate).toDate(),
                true,
            )
        }

        // If start date is after the first repeating instance, delete all before
        if (dayjs(startDate).isAfter(firstRepeatingInstanceDate)) {
            await getConnection()
            .createQueryBuilder()
            .delete()
            .from(TaskEntity)
            .where('taskMetaData = :taskMetaDataId', { taskMetaDataId: taskMetaData.id })
            .andWhere('date < :newStartDate', { newStartDate: startDate })
            .execute()
            .catch(() => {
                throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
            })
        }
    }

    taskInstanceToCreateDates = await removeExisting(taskInstanceToCreateDates, updatedTask)
    await deleteAllInstancesNotMatchingFilter(rruleObj, taskMetaData, maxDateRangeEndDate)

    const taskEntitiesToCreate: TaskEntity[] = []

    // Get and verify task card
    const tasksTaskCard: TaskCardEntity | undefined = await getConnection().getRepository(TaskCardEntity).findOne(taskCardId)
    if (!tasksTaskCard) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Create task instances from toBeCreated list
    taskInstanceToCreateDates.forEach((repeatingTaskDateInstanceDate) => {
        const taskEntity = new TaskEntity()

        taskEntity.date = repeatingTaskDateInstanceDate
        taskEntity.taskCard = tasksTaskCard
        taskEntity.taskMetaData = taskMetaData

        taskEntitiesToCreate.push(taskEntity)
    })

    taskMetaData.nextRepeatingInstance = nextRepeatingInstance

    // If no tasks to create, update only meta data, else create tasks and update meta data
    if (_.isEmpty(taskInstanceToCreateDates)) {
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

// First ('DESC') or last ('ASC')
export const getEdgeTaskInstance = async (task: TaskEntity, instanceToGet: 'ASC' | 'DESC') => {
    const { taskMetaData } = task

    const instance =
        await getConnection()
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where('task.taskMetaData = :taskMetaDataId', { taskMetaDataId: taskMetaData.id })
        .andWhere('task.date > :today', { today: dayjs.utc(dayjs().startOf('day').toDate()) })
        .orderBy('date', instanceToGet)
        .getOne()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

    return instance?.date
}

// Get existing task instances and remove all existing from taskInstanceToCreateDates
const removeExisting = async (taskInstanceToCreateDates: Date[], updatedTask) => {

    // Get and verify existing task meta data
    const existingTaskMetaData: TaskMetaDataEntity | undefined =
        await getConnection()
        .getRepository(TaskMetaDataEntity)
        .findOne(updatedTask.taskMetaData.id)
    if (!existingTaskMetaData) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // If rrule exists, existing instances exist and we can check for duplicate instances in taskInstanceToCreateDates
    if (existingTaskMetaData.rrule) {
        const rruleObj = rrulestr(existingTaskMetaData.rrule)
        const existingTaskInstances = rruleObj.all()

        // Remove all taskInstanceToCreateDates that already exist
        existingTaskInstances.forEach((existingTaskInstance) => {
            _.remove(taskInstanceToCreateDates, (taskInstanceToCreateDate) => {
                return dayjs(taskInstanceToCreateDate).isSame(existingTaskInstance)
            })
        })
    }

    return taskInstanceToCreateDates
}

// Delete all instances from database that dont match the rrule filter
const deleteAllInstancesNotMatchingFilter = async (rruleObj: RRule, taskMetaData: TaskMetaDataEntity, maxDateRangeEndDate: Dayjs) => {
    const { startDate, endDate, id: taskMetaDataId } = taskMetaData

    // Dates that match rrule filter
    const matchingDates = rruleObj.between(
        dayjs(startDate).toDate(),
        dayjs(endDate || maxDateRangeEndDate).toDate(),
        true,
    )

    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(TaskEntity)
    .where('taskMetaData = :taskMetaDataId', { taskMetaDataId })
    .andWhere('date NOT IN (:...matchingDates)', { matchingDates })
    .execute()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
