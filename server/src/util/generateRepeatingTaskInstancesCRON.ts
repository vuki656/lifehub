import { UserInputError } from 'apollo-server'
import { CronJob } from 'cron'
import moment from 'moment'
import { getRepository } from 'typeorm'
import { RepeatingTaskInstanceEntity } from '../entities/repeatingTaskInstance'
import { TaskEntity } from '../entities/task'

export const generateRepeatingTaskInstancesCRON = () => {
    const job = new CronJob('30 * * * * *', async () => {
            console.log('fired')

            const repeatingTasks =
                await getRepository(TaskEntity)
                .createQueryBuilder('task')
                .where(`task.isRepeating = :isRepeating`, { isRepeating: true })
                .getMany()

            const nextRepeatingTaskInstances: RepeatingTaskInstanceEntity[] = []
            const tasksToBeUpdated: TaskEntity[] = []

            for (const repeatingTaskRoot of repeatingTasks) {
                const nextRepeatingTaskInstance = moment(repeatingTaskRoot.nextRepeatingInstance)

                if (nextRepeatingTaskInstance.isBefore(moment().add(21, 'days'))) {
                    const taskInstance = new RepeatingTaskInstanceEntity()

                    taskInstance.taskId = repeatingTaskRoot!
                    taskInstance.date = nextRepeatingTaskInstance.toDate()

                    nextRepeatingTaskInstances.push(taskInstance)

                    // YOU NEED TO UPDATE EACH TASK NEXT REPEATING INSTANCE DATE AFTER GENERATION FINISHES
                    // PROBLEMS WHERE WITH ASYNC AWAIT IN THAT IT WASNT WAITING EVERY TIME AND DATE WASNT UPDATED => INFINITE TASKS
                    // YOU CAN PROBABLY USE THE CODE BELOW

                    // tasksToBeUpdated.push({
                    //     ...repeatingTaskRoot,
                    //     nextRepeatingInstance: nextRepeatingTaskInstance
                    // })
                }
            }

            // Save next repeating task instances
            await getRepository(RepeatingTaskInstanceEntity)
            .save(nextRepeatingTaskInstances)
            .catch(() => {
                throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
            })
        },
    )

    job.start()
}
