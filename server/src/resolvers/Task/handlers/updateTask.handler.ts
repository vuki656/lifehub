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

    // Generate task instances if its repeating and get next instance
    if (taskToUpdate.isRepeating) {
        await generateNextRepeatingInstance(taskToUpdate)
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

const generateNextRepeatingInstance = async (taskToUpdate) => {
    const { rrule, endDate, date: startDate, id, nextRepeatingInstance } = taskToUpdate
    const rruleObj = rrulestr(rrule)
    const parentTask = await getRepository(TaskEntity).findOne(id)
    let _startDate
    let _endDate

    // WHAT YOU CAN TRY IS GETTING THE REPEATIN
    // INSTANCE EQUVALENT TO END DATE AND IF EXISTS DONT CREATE NEW ONES
    // if(shouldGenerateMoreInstances(endDate)) {
    //
    // }

    // If next repeating instance exists, use it as start date from
    // which to generate future repeating instance on task update
    // REASON: To not make duplicate repeating instances if starting from startDate again
    if (nextRepeatingInstance) {
        _startDate = moment(nextRepeatingInstance).toDate()
    } else {
        _startDate = moment(startDate).toDate()
    }

    // If end date exists, use it if its not over 20 days
    // Else use default 20 days range
    // REASON: No need for instances newer than 20 days
    if (endDate && moment(endDate).isBefore(moment().add(20, 'days'))) {
        _endDate = moment(endDate).toDate()
    } else {
        _endDate = moment().add(21, 'days').toDate()
    }

    // Generate dates for repeating task instances including end date if applies
    const taskDateInstances = rruleObj.between(_startDate, _endDate, true)
    const taskInstanceEntities: RepeatingTaskInstanceEntity[] = []

    // Make a repeating task instance entity for each date in the date range
    taskDateInstances.forEach((taskDateInstance) => {
        const taskInstance = new RepeatingTaskInstanceEntity()

        taskInstance.taskId = parentTask!
        taskInstance.date = taskDateInstance

        taskInstanceEntities.push(taskInstance)
    })

    // Save repeating task instances
    await getRepository(RepeatingTaskInstanceEntity)
    .save(taskInstanceEntities)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    // If end date inside 21 day range, no need to generate more
    // So nextRepeatingInstance can be set to null
    if (moment(endDate).isBefore(moment().add(21, 'days'))) {
        return null
    }

    // Return next repeating instance of task
    return rruleObj.after(_.last(taskDateInstances))
}
