import { UserInputError } from 'apollo-server'
import { addDays, isBefore, isEqual, parseISO } from 'date-fns'
import _ from 'lodash'
import moment from 'moment'
import { RRule, rrulestr } from 'rrule'
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

const updateRepeatingInstances = async (task) => {
    const { endDate, rrule, date: startDate, id: taskId } = task

    const firstRepeatingInstanceDate = await getEdgeRepeatingInstanceDate(task, 'ASC')
    const lastRepeatingInstanceDate: Date | undefined = await getEdgeRepeatingInstanceDate(task, 'DESC')
    const rruleObj = rrulestr(rrule)
    const maxDateRangeEndDate = moment().add(20, 'days')
    const toBeCreatedRepeatingTaskInstances: RepeatingTaskInstanceEntity[] = []
    let nextRepeatingInstance: Date | null = null
    let repeatingTaskDateInstances: Date[] = []
    let updatedStartDate = startDate

    // FIRST REPEATING INSTNACE ISNT GOING TO EXIST IF INSTANCES ARE JUST BEING CREATED
    if (!isEqual(startDate, firstRepeatingInstanceDate)) {
        // SET THE STRT DATE TO FIRST REPEATING INSTANCE
        updatedStartDate = updateRoot()
    }

    // If end date before max day span, generate all, set next repeating instance to null
    if (moment(endDate).isBefore(maxDateRangeEndDate)) {
        repeatingTaskDateInstances = rruleObj.between(
            moment(startDate).add(1, 'day').toDate(), // Skip day after start date because start date === root task
            maxDateRangeEndDate.toDate(),
            true,
        )
        nextRepeatingInstance = null
        console.log('1')
        console.log(repeatingTaskDateInstances)
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (moment(endDate).isAfter(maxDateRangeEndDate)) {
        repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), maxDateRangeEndDate.toDate(), true)
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('2')
        console.log(repeatingTaskDateInstances)
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), maxDateRangeEndDate.toDate(), true)
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('3')
        console.log(repeatingTaskDateInstances)
    }

    // If new end date is after the old one, delete old instances
    if (lastRepeatingInstanceDate && moment(endDate).isAfter(lastRepeatingInstanceDate)) {
        repeatingTaskDateInstances = rruleObj.between(
            moment(lastRepeatingInstanceDate).add(1, 'day').toDate(), // +1 day from last existing instance
            maxDateRangeEndDate.toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('4')
        console.log(repeatingTaskDateInstances)
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

    // If first repeating instance exists, then we can do checks
    // If gap between first instance and start date
    // If gap start date after first instance
    if (firstRepeatingInstanceDate) {

        // Start date should always be 1 instance (or 1 day if repeating every day) before first repeating instance
        // If its more than 1, then we need to add more
        // PROBABY THIS SHOULD ONLY BE CASE IF REPEATING EVERY DAY
        const adjustedStartDate: Date = addDays(parseISO(startDate), 1)

        // comparison should take into account the start date and first repating instance
        // how to make the regular root + children not be taken into account

        // IF ROOT DOESNET MATCH REPEATING, IT STILL REPLACES THE FIRST INSTANCE
        // ROOT SHOULD BE READJUSTED TO FIRST REPEATING INSTANCE IF AT FIRST IT DOESNET MATCH THE PARAMS

        console.log(startDate)
        console.log(adjustedStartDate)
        console.log(firstRepeatingInstanceDate)

        // If start date is before the first repeating instance, create difference
        if (isBefore(adjustedStartDate, firstRepeatingInstanceDate)) {
            repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), moment(firstRepeatingInstanceDate).toDate())
            console.log('5')
            console.log(repeatingTaskDateInstances)
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

    // TODO: check cases for this
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

// TODO: write doc
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
// If 'DESC' get last one, if 'ASC' get first one
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

// If root task doesn't match the repeating params, set it as first repeating instance
const updateRoot = (startDate, rruleObj: RRule, firstRepeatingInstnace) => {

    const firstRepeatingInstance = rruleObj.after(startDate)

}
