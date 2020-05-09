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
        await generateNextRepeatingInstances(taskToUpdate)
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

const generateNextRepeatingInstances = async (task: TaskEntity) => {
    const { endDate, rrule, date, id } = task

    const rruleObj = rrulestr(rrule)
    let repeatingTaskDateInstances: Date[] = []
    let nextRepeatingInstance: Date | null = null
    const toBeCreatedRepeatingTaskInstances: RepeatingTaskInstanceEntity[] = []
    const lastRepeatingInstanceDate: Date | undefined = await getLastRepeatingInstanceDate(task)

    // If end date before max day span, general all, set next repeating instance to null
    if (moment(endDate).isBefore(moment().add(20, 'days'))) {
        repeatingTaskDateInstances = rruleObj.all()
        nextRepeatingInstance = null
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (moment(endDate).isAfter(moment().add(20, 'days'))) {
        repeatingTaskDateInstances = rruleObj.between(
            moment(date).toDate(),
            moment().add(20, 'days').toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(moment().add(20, 'days').toDate())
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        repeatingTaskDateInstances = rruleObj.between(
            moment(date).toDate(),
            moment().add(20, 'days').toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(moment().add(20, 'days').toDate())
    }

    // If new end date is after the old one
    if (moment(endDate).isAfter(lastRepeatingInstanceDate)) {
        repeatingTaskDateInstances = rruleObj.between(
            moment(lastRepeatingInstanceDate).add(1, 'day').toDate(), // +1 day from existing instance
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
    }

    // If last repeating instance from list already exists, we don't need to create more
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

const getLastRepeatingInstanceDate = async (task: TaskEntity) => {
    const { id } = task

    const instance =
        await getConnection()
        .getRepository(RepeatingTaskInstanceEntity)
        .createQueryBuilder('repeatingTaskInstance')
        .where('repeatingTaskInstance.taskId = :taskId', { taskId: id })
        .andWhere('repeatingTaskInstance.date > :dateToCheck', { dateToCheck: moment().startOf('day').utc().toDate() })
        .orderBy('date', 'DESC')
        .getOne()

    return instance?.date
}
