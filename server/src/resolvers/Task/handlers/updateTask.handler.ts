import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

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

    // Try to save updated task
    return getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
