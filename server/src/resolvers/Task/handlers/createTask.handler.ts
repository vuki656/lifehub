import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'

import { TaskEntity } from '../../../entities/task'
import { TaskCardEntity } from '../../../entities/taskCard'

export const createTaskHandler = async (input) => {
    const { title, note, checked, date, taskCardId, rrule, isRepeating } = input

    // Get task card
    const foundTaskCard = await getRepository(TaskCardEntity).findOne({ where: { id: taskCardId } })

    // Throw error if no task card
    if (!foundTaskCard) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Save task
    const task = new TaskEntity()
    task.title = title
    task.note = note
    task.checked = checked
    task.date = date
    task.taskCardId = foundTaskCard
    task.rrule = rrule
    task.isRepeating = isRepeating

    const createdTask = await getRepository(TaskEntity)
    .save(task)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    // TODO: figure out why is this not just return from save funct
    return {
        id: createdTask.id,
        title: createdTask.title,
        checked: createdTask.checked,
        date: createdTask.date,
        taskCardId: createdTask.taskCardId.id,
        rrule: createdTask.rrule,
        isRepeating: createdTask.isRepeating,
    }
}
