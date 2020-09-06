import { UserInputError } from 'apollo-server'
import { CronJob } from 'cron'
import dayjs from 'dayjs'
import { rrulestr } from 'rrule'
import {
    getConnection,
    getRepository,
} from 'typeorm'

import { TaskEntity } from '../entities/task'
import { TaskMetaDataEntity } from '../entities/taskMetaData'

export const generateRepeatingTaskInstancesCRON = new CronJob(
    '00 00 00 * * *',
    async () => {
        const tomorrow = dayjs().add(1, 'day').toDate()

        // Get all task metadata where next repeating instance is tomorrow
        const repeatingTaskMetaData =
                await getRepository(TaskMetaDataEntity)
                .createQueryBuilder('taskMetaData')
                .where('taskMetaData.isRepeating = :isRepeating', { isRepeating: true })
                .andWhere('taskMetaData.nextRepeatingInstance = :tomorrow', { tomorrow })
                .getMany()

        const tasksToCreate: TaskEntity[] = []

        // Create a task to create and set the next repeating instance
        const updatedRepeatingTaskMetadata = repeatingTaskMetaData.map((repeatingTaskMetaData) => {
            const taskToCreate = new TaskEntity()
            taskToCreate.date = tomorrow
            taskToCreate.taskMetaData = repeatingTaskMetaData
            tasksToCreate.push(taskToCreate)

            const rruleObj = rrulestr(repeatingTaskMetaData.rrule!)
            repeatingTaskMetaData.nextRepeatingInstance = rruleObj.after(tomorrow)
            return repeatingTaskMetaData
        })

        // Save task tasks and task meta data to database
        await getConnection().transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager.save(tasksToCreate)
            await transactionalEntityManager.save(updatedRepeatingTaskMetadata)
        })
        .catch(() => {
            throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
        })
    },
)
