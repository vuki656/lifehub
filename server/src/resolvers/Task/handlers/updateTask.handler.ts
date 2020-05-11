import { UserInputError } from 'apollo-server'
import _ from 'lodash'
import moment from 'moment'
import { rrulestr } from 'rrule'
import { getConnection, getRepository } from 'typeorm'

import { RepeatingTaskInstanceEntity } from '../../../entities/repeatingTaskInstance'
import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id, selectedDate } = input

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
    const updatedTask = await getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return updatedTask

    // // TODO: THIS KINDA WORKS
    // const returnData = await getRepository(TaskEntity)
    // .createQueryBuilder('task')
    // .leftJoinAndSelect(
    //     'task.repeatingTaskInstances', 'repeatingTaskInstance',
    //     'repeatingTaskInstance.date = :selectedDate', { selectedDate },
    // )
    // .where(`task.taskCardId = :taskCardId`, { taskCardId: updatedTask.taskCardId })
    // .andWhere(new Brackets(queryBuilder => {
    //     queryBuilder.where(`task.date = :selectedDate`, { selectedDate })
    //     .orWhere(`repeatingTaskInstance.date = :selectedDate`, { selectedDate })
    // }))
    // .getOne()
    // .catch(() => {
    //     throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    // })
    //
    // console.log(returnData)
    //
    // return returnData
}

const updateRepeatingInstances = async (task: TaskEntity) => {
    const { endDate, rrule, date: startDate, id } = task

    const firstRepeatingInstanceDate: Date | undefined = await getEdgeRepeatingInstanceDate(task, 'ASC')
    const lastRepeatingInstanceDate: Date | undefined = await getEdgeRepeatingInstanceDate(task, 'DESC')
    const rruleObj = rrulestr(rrule)

    let nextRepeatingInstance: Date | null = null
    let repeatingTaskDateInstances: Date[] = []
    const toBeCreatedRepeatingTaskInstances: RepeatingTaskInstanceEntity[] = []

    // If end date before max day span, generate all, set next repeating instance to null
    if (moment(endDate).isBefore(moment().add(20, 'days'))) {
        repeatingTaskDateInstances = rruleObj.all()
        nextRepeatingInstance = null
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (moment(endDate).isAfter(moment().add(20, 'days'))) {
        repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), moment().add(20, 'days').toDate(), true)
        nextRepeatingInstance = rruleObj.after(moment().add(20, 'days').toDate())
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), moment().add(20, 'days').toDate(), true)
        nextRepeatingInstance = rruleObj.after(moment().add(20, 'days').toDate())
    }

    // If new end date is after the old one
    if (moment(endDate).isAfter(lastRepeatingInstanceDate)) {
        repeatingTaskDateInstances = rruleObj.between(
            moment(lastRepeatingInstanceDate).add(1, 'day').toDate(), // +1 day from last existing instance
            moment().add(20, 'days').toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(moment().add(20, 'days').toDate())
    }

    // If new end date is before the old one, delete all instances after the new one
    if (moment(endDate).isBefore(lastRepeatingInstanceDate)) {
        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(RepeatingTaskInstanceEntity)
        .where('taskId = :taskId', { taskId: id })
        .andWhere('date > :newEndDate', { newEndDate: endDate })
        .execute()

        nextRepeatingInstance = null
    }

    // If start date is before the original (before the first repeating instance)
    if (moment(startDate).isBefore(firstRepeatingInstanceDate)) {
        repeatingTaskDateInstances = rruleObj.between(moment(startDate).toDate(), moment(firstRepeatingInstanceDate).toDate())
    }

    // the problem is that the first one is always going to be the root, so first repeating instance
    // is going to be 1 day after

    // If start date is after the original (after the first repeating instance)
    if (moment(startDate).isAfter(firstRepeatingInstanceDate)) {
        console.log(firstRepeatingInstanceDate)
        console.log(startDate)

        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(RepeatingTaskInstanceEntity)
        .where('taskId = :taskId', { taskId: id })
        .andWhere('date < :newStartDate', { newStartDate: startDate })
        .execute()
    }

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
}

// First or last
const getEdgeRepeatingInstanceDate = async (task: TaskEntity, instanceToGet: 'ASC' | 'DESC') => {
    const { id } = task

    const instance =
        await getConnection()
        .getRepository(RepeatingTaskInstanceEntity)
        .createQueryBuilder('repeatingTaskInstance')
        .where('repeatingTaskInstance.taskId = :taskId', { taskId: id })
        .andWhere('repeatingTaskInstance.date > :dateToCheck', { dateToCheck: moment().startOf('day').utc().toDate() })
        .orderBy('date', instanceToGet) // If 'DESC' get last one, if 'ASC' get first one
        .getOne()

    return instance?.date
}
