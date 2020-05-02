import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'
import { TaskEntity } from '../../../entities/task'
import { TaskCardEntity } from '../../../entities/taskCard'

export const createTaskHandler = async (input) => {
    const { title, note, checked, date, taskCardId } = input

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

    const createdTask = await getRepository(TaskEntity)
    .save(task)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })

    return {
        id: createdTask.id,
        title: createdTask.title,
        checked: createdTask.checked,
        date: createdTask.date,
        taskCardId: createdTask.taskCardId.id,
    }
}
