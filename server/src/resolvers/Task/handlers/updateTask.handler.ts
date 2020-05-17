import { UserInputError } from 'apollo-server'
import dayjs from 'dayjs'
import { RRule, rrulestr } from 'rrule'
import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id, title, note, date, taskMetaData } = input.input

    console.log(input.input)

    // Verify existence and get task to update
    const taskToUpdate: TaskEntity | undefined = await TaskEntity.findOne(id)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Generate task instances if its repeating and get next instance
    if (taskToUpdate.taskMetaData.isRepeating) {
        await createRepeatingInstances(taskToUpdate)
    }

    Object.assign(taskToUpdate, input)

}

const createRepeatingInstances = (task: TaskEntity) => {
    const { taskMetaData } = task
    const { startDate, endDate, rrule } = taskMetaData

    const maxDateRangeEndDate = dayjs().add(20, 'day')
    const rruleObj: RRule = rrulestr(rrule)

    let nextRepeatingInstance: Date | null = null
    let repeatingTaskDateInstances: Date[] = []

    // If end date before max day span, generate all, set next repeating instance to null
    if (dayjs(endDate).isBefore(maxDateRangeEndDate)) {
        repeatingTaskDateInstances = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
        )
        nextRepeatingInstance = null
        console.log('1')
        console.log(repeatingTaskDateInstances)
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (dayjs(endDate).isAfter(maxDateRangeEndDate)) {
        repeatingTaskDateInstances = rruleObj.between(dayjs(startDate).toDate(), maxDateRangeEndDate.toDate(), true)
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('2')
        console.log(repeatingTaskDateInstances)
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        repeatingTaskDateInstances = rruleObj.between(dayjs(startDate).toDate(), maxDateRangeEndDate.toDate(), true)
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('3')
        console.log(repeatingTaskDateInstances)
    }
}
