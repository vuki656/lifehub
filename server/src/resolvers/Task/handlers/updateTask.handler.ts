import { UserInputError } from 'apollo-server'
import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id, title, note, date, taskMetaData } = input.input

    console.log(input.input)

    // Verify existence and get task to update
    const taskToUpdate: TaskEntity | undefined = await TaskEntity.findOne(id)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    Object.assign(taskToUpdate, input)

}
