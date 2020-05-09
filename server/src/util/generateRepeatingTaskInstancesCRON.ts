import { UserInputError } from 'apollo-server'
import { CronJob } from 'cron'
import moment from 'moment'
import { rrulestr } from 'rrule'
import { getConnection, getRepository } from 'typeorm'

import { RepeatingTaskInstanceEntity } from '../entities/repeatingTaskInstance'
import { TaskEntity } from '../entities/task'

export const generateRepeatingTaskInstancesCRON = () => {
    const job = new CronJob(
        '00 00 00 * * *',
        async () => {
            // Get all repeating root tasks where next repeating instance isn't null
            const repeatingTasks =
                await getRepository(TaskEntity)
                .createQueryBuilder('task')
                .where(`task.isRepeating = :isRepeating`, { isRepeating: true })
                .andWhere('task.nextRepeatingInstance is not null')
                .getMany()

            const nextRepeatingTaskInstances: RepeatingTaskInstanceEntity[] = []
            const tasksToBeUpdated: TaskEntity[] = []

            // Create repeatingTaskInstance for each repeating task and update nextRepeatingInstance in that task
            for (const repeatingTaskRoot of repeatingTasks) {
                const rruleObj = rrulestr(repeatingTaskRoot.rrule)
                const nextRepeatingTaskInstanceMoment = moment(repeatingTaskRoot.nextRepeatingInstance!)

                if (nextRepeatingTaskInstanceMoment.isBefore(moment().add(21, 'days'))) {
                    const taskInstance = new RepeatingTaskInstanceEntity()

                    taskInstance.taskId = repeatingTaskRoot!
                    taskInstance.date = nextRepeatingTaskInstanceMoment.toDate()

                    nextRepeatingTaskInstances.push(taskInstance)
                    tasksToBeUpdated.push(
                        Object.assign(
                            repeatingTaskRoot,
                            { nextRepeatingInstance: rruleObj.after(nextRepeatingTaskInstanceMoment.toDate()) },
                        ),
                    )
                }
            }

            await getConnection().transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(tasksToBeUpdated)
                await transactionalEntityManager.save(nextRepeatingTaskInstances)
            })
            .catch(() => {
                throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
            })
        },
    )

    job.start()
}
