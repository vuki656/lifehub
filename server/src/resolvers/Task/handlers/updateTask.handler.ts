import { UserInputError } from 'apollo-server'
import _ from 'lodash'
import moment from 'moment'
import { rrulestr } from 'rrule'
import { getRepository } from 'typeorm'

import { RepeatingTaskInstanceEntity } from '../../../entities/repeatingTaskInstance'

import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id } = input

    const taskToUpdate = await TaskEntity.findOne(id)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    Object.assign(taskToUpdate, input)

    // Generate task instances if its repeating and get last instance
    if (taskToUpdate.isRepeating) {
        await generateRepeatingTaskInstances(taskToUpdate)
        .then((response) => {
            taskToUpdate.lastRepeatingInstance = response
        })
    }

    // Try to save updated task
    return getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}

const generateRepeatingTaskInstances = async ({ rrule, endDate, date: startDate, id, lastRepeatingInstance }) => {
    const rruleObj = rrulestr(rrule)
    const parentTask = await getRepository(TaskEntity).findOne(id)
    let _startDate
    let _endDate

    // If last repeating instance is after task start date, use it
    // REASON: To not make duplicate repeating instances
    if (moment(startDate).isBefore(lastRepeatingInstance)) {
        _startDate = moment(lastRepeatingInstance).toDate()
    } else {
        _startDate = moment(startDate).toDate()
    }

    // If end date is before 20 days from today, use it, else use today + 25 days
    // REASON: Frontend day span is 20 days, 5 for extra leeway, no need for more
    if (endDate && moment(endDate).isBefore(moment().add(20, 'days'))) {
        _endDate = moment(endDate).toDate()
    } else {
        _endDate = moment().add(25, 'days').toDate()
    }

    const taskDateInstances = rruleObj.between(_startDate, _endDate)
    const taskInstanceEntities: RepeatingTaskInstanceEntity[] = []

    // Make a repeating task instance entity for each date in the date range
    taskDateInstances.forEach((taskDateInstance) => {
        const taskInstance = new RepeatingTaskInstanceEntity()

        taskInstance.date = taskDateInstance
        taskInstance.taskId = parentTask!

        taskInstanceEntities.push(taskInstance)
    })

    // Save repeating task instances
    await getRepository(RepeatingTaskInstanceEntity)
    .save(taskInstanceEntities)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    // Return last task day instance
    return _.last(taskDateInstances)
}
