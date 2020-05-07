import { UserInputError } from 'apollo-server'
import moment from 'moment'
import { rrulestr } from 'rrule'
import { getRepository } from 'typeorm'
import { RepeatingTaskInstanceEntity } from '../../../entities/repeatingTaskInstance'

import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id, title, note, date, endDate, checked, rrule, isRepeating } = input

    const taskToUpdate = await TaskEntity.findOne(id)

    // Throw error if no task
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    taskToUpdate.title = title || taskToUpdate.title
    taskToUpdate.note = note || taskToUpdate.note
    taskToUpdate.checked = checked || taskToUpdate.checked
    taskToUpdate.date = date || taskToUpdate.date
    taskToUpdate.rrule = rrule || taskToUpdate.rrule
    taskToUpdate.isRepeating = isRepeating || taskToUpdate.isRepeating
    taskToUpdate.endDate = endDate || taskToUpdate.endDate

    // Generate task instances if its repeating
    if (taskToUpdate.isRepeating) generateRepeatingTaskInstances(taskToUpdate)

    // Try to save updated task
    return getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}

const generateRepeatingTaskInstances = async ({ rrule, endDate, date: startDate, id }) => {
    const rruleObj = rrulestr(rrule)
    const parentTask = await getRepository(TaskEntity).findOne(id)
    let _endDate

    // If end date is before 20 days from today, use it, else use today + 20 days
    // REASON: Frontend day span is 20 days
    if (endDate && moment(endDate).isBefore(moment().add(20, 'days'))) {
        _endDate = moment(endDate).toDate()
    } else {
        _endDate = moment().add(30, 'days').toDate()
    }

    const taskDateInstances = rruleObj.between(moment(startDate).toDate(), _endDate)
    const taskInstanceEntities: RepeatingTaskInstanceEntity[] = []

    taskDateInstances.forEach((taskDateInstance) => {
        const taskInstance = new RepeatingTaskInstanceEntity()
        taskInstance.date = taskDateInstance
        taskInstance.taskId = parentTask!
        taskInstanceEntities.push(taskInstance)
    })

    const createdTasks =
        await getRepository(RepeatingTaskInstanceEntity)
        .save(taskInstanceEntities)
        .catch((err) => {
            console.log(err)
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

}
