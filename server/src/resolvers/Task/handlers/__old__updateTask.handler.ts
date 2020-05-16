import { UserInputError } from 'apollo-server'
import dayjs from 'dayjs'
import _ from 'lodash'
import moment from 'moment'
import { RRule, rrulestr } from 'rrule'
import { getConnection, getRepository } from 'typeorm'

import { RepeatingTaskInstanceEntity } from '../../../entities/repeatingTaskInstance'
import { TaskEntity } from '../../../entities/task'

export const __old__updateTaskHandler = async (input) => {
    const { id } = input

    const taskToUpdate = await TaskEntity.findOne(id)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    Object.assign(taskToUpdate, input)

    // Generate task instances if its repeating and get next instance
    if (taskToUpdate.isRepeating) {
        await updateRepeatingInstances(taskToUpdate)
        .then((response) => {
            taskToUpdate.nextRepeatingInstance = response?.nextRepeatingInstance!
            taskToUpdate.date = response?.date!
        })
    }

    // Try to save updated task
    return getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}

const updateRepeatingInstances = async (task) => {
    const { endDate, date: startDate, rrule, id: taskId } = task

    const rruleObj: RRule = rrulestr(rrule)
    const maxDateRangeEndDate = dayjs().add(20, 'day')
    const firstRepeatingInstanceDate = await getEdgeRepeatingInstanceDate(task, 'ASC')
    const lastRepeatingInstanceDate: Date | undefined = await getEdgeRepeatingInstanceDate(task, 'DESC')
    const updatedStartDate: Date = updateRoot(task, rruleObj)

    const toBeCreatedRepeatingTaskInstances: RepeatingTaskInstanceEntity[] = []
    let nextRepeatingInstance: Date | null = null
    let repeatingTaskDateInstances: Date[] = []

    // If end date before max day span, generate all, set next repeating instance to null
    if (dayjs(endDate).isBefore(maxDateRangeEndDate)) {
        repeatingTaskDateInstances = rruleObj.between(
            dayjs(updatedStartDate).toDate(),
            maxDateRangeEndDate.toDate(),
        )
        nextRepeatingInstance = null
        console.log('1')
        console.log(repeatingTaskDateInstances)
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (dayjs(endDate).isAfter(maxDateRangeEndDate)) {
        repeatingTaskDateInstances = rruleObj.between(dayjs(updatedStartDate).toDate(), maxDateRangeEndDate.toDate(), true)
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('2')
        console.log(repeatingTaskDateInstances)
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        repeatingTaskDateInstances = rruleObj.between(dayjs(updatedStartDate).toDate(), maxDateRangeEndDate.toDate(), true)
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('3')
        console.log(repeatingTaskDateInstances)
    }

    // If new end date is after the old one, delete old instances
    if (lastRepeatingInstanceDate && dayjs(endDate).isAfter(lastRepeatingInstanceDate)) {
        repeatingTaskDateInstances = rruleObj.between(
            dayjs(lastRepeatingInstanceDate).add(1, 'day').toDate(), // +1 day from last existing instance
            maxDateRangeEndDate.toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('4')
        console.log(repeatingTaskDateInstances)
    }

    // If new end date is before the old one, delete all instances after the new one
    if (lastRepeatingInstanceDate && dayjs(endDate).isBefore(lastRepeatingInstanceDate)) {
        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(RepeatingTaskInstanceEntity)
        .where('taskId = :taskId', { taskId })
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

        // IT DOESENT UPDATE START DATE AKA TASK ROOT DATE IF SWITCHED FROM DAILY TO WEEKLY

        // If start date is before the first repeating instance, create difference
        if (dayjs(updatedStartDate).isBefore(firstRepeatingInstanceDate)) {
            repeatingTaskDateInstances = rruleObj.between(dayjs(updatedStartDate).toDate(), dayjs(firstRepeatingInstanceDate).toDate(), true)
            console.log('5')
            console.log(repeatingTaskDateInstances)
        }

        // If start date is after the original (after the first repeating instance) delete all before
        if (dayjs(updatedStartDate).isAfter(firstRepeatingInstanceDate)) {
            await getConnection()
            .createQueryBuilder()
            .delete()
            .from(RepeatingTaskInstanceEntity)
            .where('taskId = :taskId', { taskId })
            .andWhere('date < :newStartDate', { newStartDate: updatedStartDate })
            .execute()
            .catch(() => {
                throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
            })
        }
    }

    await removeAllInstancesNotMatchingFilter(rruleObj, taskId, updatedStartDate, endDate, maxDateRangeEndDate)

    // TODO THINK THIS OVER
    if (await checkIfRepeatingInstancesExist(task, repeatingTaskDateInstances)) {
        return { date: updatedStartDate }
    }

    // If something to update
    if (repeatingTaskDateInstances) {

        // Create repeating task instances from date list
        repeatingTaskDateInstances.forEach((repeatingTaskDateInstance) => {
            const repeatingTaskInstance = new RepeatingTaskInstanceEntity()

            repeatingTaskInstance.taskId = task
            repeatingTaskInstance.date = repeatingTaskDateInstance

            toBeCreatedRepeatingTaskInstances.push(repeatingTaskInstance)
        })

        // Save repeating date instances
        await getRepository(RepeatingTaskInstanceEntity)
        .save(toBeCreatedRepeatingTaskInstances)
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }

    return {
        nextRepeatingInstance,
        date: updatedStartDate,
    }
}

// If last repeating instance to be created from list already exists, dont create more
// To prevent duplicates
const checkIfRepeatingInstancesExist = (task: TaskEntity, repeatingTaskDateInstances: Date[]) => {
    const { id } = task

    const instanceDateToCheck = _.last(repeatingTaskDateInstances)

    return getConnection()
    .getRepository(RepeatingTaskInstanceEntity)
    .createQueryBuilder('repeatingTaskInstance')
    .where('repeatingTaskInstance.taskId = :taskId', { taskId: id })
    .andWhere('repeatingTaskInstance.date = :dateToCheck', { dateToCheck: instanceDateToCheck })
    .getOne()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}

// First ('DESC') or last ('ASC')
export const getEdgeRepeatingInstanceDate = async (task: TaskEntity, instanceToGet: 'ASC' | 'DESC') => {
    const { id } = task

    const instance =
        await getConnection()
        .getRepository(RepeatingTaskInstanceEntity)
        .createQueryBuilder('repeatingTaskInstance')
        .where('repeatingTaskInstance.taskId = :taskId', { taskId: id })
        .andWhere('repeatingTaskInstance.date > :dateToCheck', { dateToCheck: moment().startOf('day').utc().toDate() })
        .orderBy('date', instanceToGet)
        .getOne()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

    return instance?.date
}

// Delete all instances from database that dont match the filter
const removeAllInstancesNotMatchingFilter = async (rruleObj, taskId, startDate, endDate, maxDateRangeEndDate) => {
    const selectedDates = rruleObj.between(
        dayjs(startDate).toDate(),
        dayjs(endDate || maxDateRangeEndDate).toDate(),
        true,
    )

    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(RepeatingTaskInstanceEntity)
    .where('taskId = :taskId', { taskId })
    .andWhere('date NOT IN (:...selectedDates)', { selectedDates })
    .execute()
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}

// If root task doesn't match the repeating params, set it as first repeating instance
const updateRoot = (task, rruleObj: RRule) => {
    const { date: startDate } = task

    const firstRepeatingInstanceDate = rruleObj.after(dayjs(startDate).toDate(), true)
    let updatedStartDate = startDate

    if (
        !dayjs(dayjs(startDate))
        .isSame(dayjs(firstRepeatingInstanceDate).toDate())
    ) {
        updatedStartDate = firstRepeatingInstanceDate
    }

    // THE PROBLEM IS THAT ROOT DATE IS SET TO FIRST REPEATING INSTANCE

    return updatedStartDate
}
