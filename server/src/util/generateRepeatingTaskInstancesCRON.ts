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
            // Get all repeating root tasks
            const repeatingTasks =
                await getRepository(TaskEntity)
                .createQueryBuilder('task')
                .where(`task.isRepeating = :isRepeating`, { isRepeating: true })
                .getMany()

            const nextRepeatingTaskInstances: RepeatingTaskInstanceEntity[] = []
            const tasksToBeUpdated: TaskEntity[] = []

            // Create repeatingTaskInstance for each repeating task and set nextRepeatingIntsance for each task
            for (const repeatingTaskRoot of repeatingTasks) {
                const rruleObj = rrulestr(repeatingTaskRoot.rrule)
                const nextRepeatingTaskInstance = moment(repeatingTaskRoot.nextRepeatingInstance)

                if (nextRepeatingTaskInstance.isBefore(moment().add(21, 'days'))) {
                    const taskInstance = new RepeatingTaskInstanceEntity()

                    taskInstance.taskId = repeatingTaskRoot!
                    taskInstance.date = nextRepeatingTaskInstance.toDate()

                    nextRepeatingTaskInstances.push(taskInstance)
                    tasksToBeUpdated.push(
                        Object.assign(
                            repeatingTaskRoot,
                            { nextRepeatingInstance: rruleObj.after(nextRepeatingTaskInstance.toDate()) },
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
