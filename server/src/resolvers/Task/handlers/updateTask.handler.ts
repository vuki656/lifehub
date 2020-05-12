import { UserInputError } from 'apollo-server'
import _ from 'lodash'
import moment from 'moment'
import { rrulestr } from 'rrule'
import { getConnection, getRepository } from 'typeorm'

import { RepeatingTaskInstanceEntity } from '../../../entities/repeatingTaskInstance'
import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id } = input

    const taskToUpdate = await TaskEntity.findOne(id)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    Object.assign(taskToUpdate, input)

    // Generate task instances if its repeating and get next instance
    if (taskToUpdate.isRepeating) {
        await updateRepeatingInstances(taskToUpdate)
        .then((nextRepeatingInstance) => {
            taskToUpdate.nextRepeatingInstance = nextRepeatingInstance
        })
    }

    // Try to save updated task
    return getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}

const updateRepeatingInstances = async (task: TaskEntity) => {
    const { endDate, rrule, date: startDate, id: taskId } = task

    if (!endDate) return new Date()

    const firstRepeatingInstanceDate: Date | undefined = await getEdgeRepeatingInstanceDate(task, 'ASC')
    const lastRepeatingInstanceDate: Date | undefined = await getEdgeRepeatingInstanceDate(task, 'DESC')
    const rruleObj = rrulestr(rrule)
    const maxDateRangeEndDate = moment().add(20, 'days')

    let nextRepeatingInstance: Date | null = null
    let repeatingTaskDateInstances: Date[] = []
    const toBeCreatedRepeatingTaskInstances: RepeatingTaskInstanceEntity[] = []

    // If end date before max day span, generate all, set next repeating instance to null
    if (moment(endDate).isBefore(maxDateRangeEndDate)) {
        repeatingTaskDateInstances = rruleObj.all()
        nextRepeatingInstance = null
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (moment(endDate).isAfter(maxDateRangeEndDate)) {
        repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), maxDateRangeEndDate.toDate(), true)
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), maxDateRangeEndDate.toDate(), true)
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
    }

    // If new end date is after the old one, delete old instances
    if (moment(endDate).isAfter(lastRepeatingInstanceDate)) {
        repeatingTaskDateInstances = rruleObj.between(
            moment(lastRepeatingInstanceDate).add(1, 'day').toDate(), // +1 day from last existing instance
            maxDateRangeEndDate.toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
    }

    // If new end date is before the old one, delete all instances after the new one
    if (moment(endDate).isBefore(lastRepeatingInstanceDate)) {
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

    if (firstRepeatingInstanceDate) {

        // If start date is before the original (before the first repeating instance), create difference
        if (moment(startDate).isBefore(firstRepeatingInstanceDate)) {
            repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), moment(firstRepeatingInstanceDate).toDate())
        }

        // If start date is after the original (after the first repeating instance) delete all before
        if (moment(startDate).isAfter(firstRepeatingInstanceDate)) {
            await getConnection()
            .createQueryBuilder()
            .delete()
            .from(RepeatingTaskInstanceEntity)
            .where('taskId = :taskId', { taskId })
            .andWhere('date < :newStartDate', { newStartDate: startDate })
            .execute()
            .catch(() => {
                throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
            })
        }
    }

    await removeAllInstancesNotMatchingFilter(rruleObj, taskId, startDate, endDate, maxDateRangeEndDate)

    // If last repeating instance from list already exists, no need to create more
    if (await checkIfRepeatingInstancesExist(task, repeatingTaskDateInstances)) {
        return null
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

    return nextRepeatingInstance
}

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

// First or last
export const getEdgeRepeatingInstanceDate = async (task: TaskEntity, instanceToGet: 'ASC' | 'DESC') => {
    const { id } = task

    const instance =
        await getConnection()
        .getRepository(RepeatingTaskInstanceEntity)
        .createQueryBuilder('repeatingTaskInstance')
        .where('repeatingTaskInstance.taskId = :taskId', { taskId: id })
        .andWhere('repeatingTaskInstance.date > :dateToCheck', { dateToCheck: moment().startOf('day').utc().toDate() })
        .orderBy('date', instanceToGet) // If 'DESC' get last one, if 'ASC' get first one
        .getOne()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

    return instance?.date
}

// Get all dates that match rrule from start to finish and delete others
const removeAllInstancesNotMatchingFilter = async (rruleObj, taskId, startDate, endDate, maxDateRangeEndDate) => {
    const selectedDates = rruleObj.between(
        moment(startDate).toDate(),
        moment(endDate || maxDateRangeEndDate).toDate(),
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
