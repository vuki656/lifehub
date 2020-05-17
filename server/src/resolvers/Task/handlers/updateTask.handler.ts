import { UserInputError } from 'apollo-server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { RRule, rrulestr } from 'rrule'
import { getConnection, getRepository } from 'typeorm'
import { TaskEntity } from '../../../entities/task'

dayjs.extend(utc)

export const updateTaskHandler = async (input) => {
    const { id, title, note, date, taskMetaData } = input.input

    // Verify existence and get task to update
    const taskToUpdate: TaskEntity | undefined = await getConnection().getRepository(TaskEntity).findOne(id)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    // Generate task instances if its repeating
    if (taskMetaData.isRepeating) await createRepeatingInstances(taskToUpdate, input.input)

    Object.assign(taskToUpdate, input)
}

const createRepeatingInstances = async (task: TaskEntity, updatedTask: TaskEntity) => {

    console.log('=====updated fired=====')

    const { taskMetaData } = updatedTask
    const { startDate, endDate, rrule } = taskMetaData

    const firstRepeatingInstanceDate: Date | undefined = await getEdgeTaskInstance(task, 'ASC')
    const lastRepeatingInstanceDate: Date | undefined = await getEdgeTaskInstance(task, 'DESC')
    const maxDateRangeEndDate = dayjs().add(20, 'day')
    const rruleObj: RRule = rrulestr(rrule)

    let nextRepeatingInstance: Date | null = null
    let taskInstanceToCreateDates: Date[] = []

    // If end date before max day span, generate all, set next repeating instance to null
    if (dayjs(endDate).isBefore(maxDateRangeEndDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
            true,
        )
        nextRepeatingInstance = null
        console.log('1')
        console.log(taskInstanceToCreateDates)
    }

    // If end date after max day span, generate until end of max day span, set next repeating instance to following one
    if (dayjs(endDate).isAfter(maxDateRangeEndDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('2')
        console.log(taskInstanceToCreateDates)
    }

    // If no end date, generate until end of max day span, set the next repeating instance to the following one
    if (!endDate) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(startDate).toDate(),
            maxDateRangeEndDate.toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('3')
        console.log(taskInstanceToCreateDates)
    }

    // If new end date is after the old one, delete old instances
    if (lastRepeatingInstanceDate && dayjs(endDate).isAfter(lastRepeatingInstanceDate)) {
        taskInstanceToCreateDates = rruleObj.between(
            dayjs(lastRepeatingInstanceDate).add(1, 'day').toDate(), // +1 day from last existing instance
            maxDateRangeEndDate.toDate(),
            true,
        )
        nextRepeatingInstance = rruleObj.after(maxDateRangeEndDate.toDate())
        console.log('4')
        console.log(taskInstanceToCreateDates)
    }

    // If something to update
    if (taskInstanceToCreateDates) {
        const taskEntitiesToCreate: TaskEntity[] = []

        // Create task instances from toBeCreated list
        taskInstanceToCreateDates.forEach((repeatingTaskDateInstance) => {
            const taskEntity = new TaskEntity()

            taskEntity.date = repeatingTaskDateInstance

            taskEntitiesToCreate.push(taskEntity)
        })

        // Save repeating date instances
        await getRepository(TaskEntity)
        .save(taskEntitiesToCreate)
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    }
}

// First ('DESC') or last ('ASC')
export const getEdgeTaskInstance = async (task: TaskEntity, instanceToGet: 'ASC' | 'DESC') => {
    const { id, taskMetaData: taskMetaDataId } = task

    const instance =
        await getConnection()
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where('task.taskMetaData = :taskMetaDataId', { taskMetaDataId })
        .andWhere('task.date > :dateToCheck', { dateToCheck: dayjs.utc(dayjs().startOf('day').toDate()) })
        .orderBy('date', instanceToGet)
        .getOne()
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })

    console.log(instance)

    return instance?.date
}
