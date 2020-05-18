import { UserInputError } from 'apollo-server'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import _ from 'lodash'
import { RRule, rrulestr } from 'rrule'
import { getConnection, getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskMetaDataEntity } from '../../../entities/taskMetaData'

dayjs.extend(utc)

export const updateTaskHandler = async (input) => {
    const { id, title, note, date, taskMetaData } = input.input

    // Verify existence and get task to update
    const taskToUpdate: TaskEntity | undefined = await getConnection().getRepository(TaskEntity).findOne(id)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Generate task instances if its repeating
    if (taskMetaData.isRepeating) await createRepeatingInstances(taskToUpdate, input.input)

    Object.assign(taskToUpdate, input)
}

const createRepeatingInstances = async (taskToUpdate: TaskEntity, updatedTask: TaskEntity) => {
    // TODO: FIX NAMING
    const { taskCard } = taskToUpdate
    const { taskMetaData, date } = updatedTask
    const { startDate, endDate, rrule } = taskMetaData

    const firstRepeatingInstanceDate: Date | undefined = await getEdgeTaskInstance(updatedTask, 'ASC')
    const lastRepeatingInstanceDate: Date | undefined = await getEdgeTaskInstance(updatedTask, 'DESC')
    const maxDateRangeEndDate: Dayjs = dayjs().add(20, 'day')
    const rruleObj: RRule = rrulestr(rrule)

    let nextRepeatingInstance: Date | null = null
    let taskInstanceToCreateDates: Date[] = []

    // If end date before max day span, generate all, set next repeating instance to null
    if (dayjs(startDate).isBefore(maxDateRangeEndDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
        )
        nextRepeatingInstance = null
        console.log('1')
        console.log(taskInstanceToCreateDates)
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (dayjs(endDate).isAfter(maxDateRangeEndDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('2')
        console.log(taskInstanceToCreateDates)
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('3')
        console.log(taskInstanceToCreateDates)
    }

    // If new end date is after the old one, delete old instances, set the next repeating instance to the following one
    if (lastRepeatingInstanceDate && dayjs(endDate).isAfter(lastRepeatingInstanceDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(lastRepeatingInstanceDate).toDate(),
            maxDateRangeEndDate.toDate(), // If rrule has no end date or rrule end date > max, max wins, else rrule end date wins
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('4')
        console.log(taskInstanceToCreateDates)
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
        .catch((err) => {
            console.log(err)
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

        nextRepeatingInstance = null
    }

    // If first repeating instance exists, then we can do checks
    // If gap between first instance and start date
    // If gap start date after first instance
    if (firstRepeatingInstanceDate) {

        // If start date is before the first repeating instance, create difference
        if (dayjs(date).isBefore(firstRepeatingInstanceDate)) {
            taskInstanceToCreateDates = rruleObj.between(
                dayjs(date).toDate(),
                dayjs(firstRepeatingInstanceDate).toDate(),
                true,
            )
            console.log('5')
            console.log(taskInstanceToCreateDates)
        }

        // If start date is after the first repeating instance, delete all before
        if (dayjs(date).isAfter(firstRepeatingInstanceDate)) {
            await getConnection()
            .createQueryBuilder()
            .delete()
            .from(TaskEntity)
            .where('taskMetaData = :taskMetaDataId', { taskMetaDataId: taskMetaData.id })
            .andWhere('date < :newStartDate', { newStartDate: date })
            .execute()
            .catch((err) => {
                console.log(err)
                throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
            })
            console.log('6')
        }
    }

    taskInstanceToCreateDates = await removeExisting(taskInstanceToCreateDates, updatedTask)

    // If something to create/update
    if (taskInstanceToCreateDates) {
        const taskEntitiesToCreate: TaskEntity[] = []

        // Create task instances from toBeCreated list
        taskInstanceToCreateDates.forEach((repeatingTaskDateInstanceDate) => {
            const taskEntity = new TaskEntity()

            taskEntity.date = repeatingTaskDateInstanceDate
            taskEntity.taskCard = taskCard
            taskEntity.taskMetaData = taskMetaData

            taskEntitiesToCreate.push(taskEntity)
        })

        // Save task instances
        await getRepository(TaskEntity)
        .save(taskEntitiesToCreate)
        .catch((err) => {
            console.log(err)
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }
}

// Check if the last task instance from taskInstanceToCreateDates list exists
const checkIfRepeatingInstancesExist = (task: TaskEntity, taskInstanceToCreateDates: Date[]) => {
    const { taskMetaData } = task

    const lastTaskInstanceToCreateDate = _.last(taskInstanceToCreateDates)

    return getConnection()
    .getRepository(TaskEntity)
    .createQueryBuilder('task')
    .where('task.taskMetaData = :taskMetaDataId', { taskMetaDataId: taskMetaData.id })
    .andWhere('task.date = :dateToCheck', { dateToCheck: lastTaskInstanceToCreateDate })
    .getOne()
    .catch((err) => {
        console.log(err)
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
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
        .catch((err) => {
            console.log(err)
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

    return instance?.date
}

// Get existing task instances and remove all existing from taskInstanceToCreateDates
const removeExisting = async (taskInstanceToCreateDates: Date[], updatedTask) => {
    const filteredList: Date[] = taskInstanceToCreateDates
    console.log('-> taskInstanceToCreateDates', taskInstanceToCreateDates)

    // Get and verify existing task meta data
    const existingTaskMetaData: TaskMetaDataEntity | undefined =
        await getConnection()
        .getRepository(TaskMetaDataEntity)
        .findOne(updatedTask.taskMetaData.id)
    if (!existingTaskMetaData) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // If rrule exists, existing instances exist and we can check for duplicates in taskInstanceToCreateDates
    if (existingTaskMetaData.rrule) {
        const rruleObj = rrulestr(existingTaskMetaData.rrule)
        const existingTaskInstances: Date[] = rruleObj.all()

        // DO GRANULA COMPARISON, FOR EACH ON A DAY ARR AND MAKE A TEST DATE TO COMPARE, SEE WHATS WRONG AND HOW
        // Remove all task instances that already exist
        existingTaskInstances.forEach((existingTaskInstance) => {
            _.remove(filteredList, (taskInstanceToCreateDate) => {
                console.log('comparing')
                console.log(taskInstanceToCreateDate)
                console.log(existingTaskInstance)
                return dayjs(taskInstanceToCreateDate).isSame(existingTaskInstance)
            })
        })
    }

    console.log('-> filteredList', filteredList)
    return filteredList
}
