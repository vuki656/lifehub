import { UserInputError } from 'apollo-server'
import { getRepository } from 'typeorm'
import { TaskEntity } from '../../../entities/task'

export const updateTaskHandler = async (input) => {
    const { id } = input

    const taskToUpdate = await TaskEntity.findOne(id)
    if (!taskToUpdate) throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })

    Object.assign(taskToUpdate, input)

    // Generate task instances if its repeating and get next instance
    // if (taskToUpdate.isRepeating) {
    //     await generateNextRepeatingInstance(taskToUpdate)
    //     .then((nextRepeatingInstance) => {
    //         taskToUpdate.nextRepeatingInstance = nextRepeatingInstance
    //     })
    // }

    // Try to save updated task
    return getRepository(TaskEntity)
    .save(taskToUpdate)
    .catch(() => {
        throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
    })
}
//
// const generateNextRepeatingInstance = async (task: TaskEntity) => {
//     const { rrule, endDate, date: startDate, id, nextRepeatingInstance } = task
//     const rruleObj = rrulestr(rrule)
//     const parentTask = await getRepository(TaskEntity).findOne(id)
//     let _startDate
//     let _endDate
//     let taskDateInstances
//
//     if (!await checkIfTasksMade(task)) {
//
//         // If next repeating instance exists, use it as start date from
//         // which to generate future repeating instance on task update
//         // REASON: To not make duplicate repeating instances if starting from startDate again
//         if (nextRepeatingInstance) {
//             _startDate = moment(nextRepeatingInstance).toDate()
//         } else {
//             _startDate = moment(startDate).toDate()
//         }
//
//         // If end date exists, use it if its not over 20 days
//         // Else use default 20 days range
//         // REASON: No need for instances newer than 20 days
//         if (endDate && moment(endDate).isBefore(moment().add(20, 'days'))) {
//             _endDate = moment(endDate).toDate()
//         } else {
//             _endDate = moment().add(21, 'days').toDate()
//         }
//
//         // Generate dates for repeating task instances including end date if applies
//         taskDateInstances = rruleObj.between(_startDate, _endDate, true)
//         const taskInstanceEntities: RepeatingTaskInstanceEntity[] = []
//
//         // Make a repeating task instance entity for each date in the date range
//         taskDateInstances.forEach((taskDateInstance) => {
//             const taskInstance = new RepeatingTaskInstanceEntity()
//
//             taskInstance.taskId = parentTask!
//             taskInstance.date = taskDateInstance
//
//             taskInstanceEntities.push(taskInstance)
//         })
//
//         // Save repeating task instances
//         await getRepository(RepeatingTaskInstanceEntity)
//         .save(taskInstanceEntities)
//         .catch(() => {
//             throw new UserInputError('Error', { error: 'Something wen\'t wrong.' })
//         })
//     }
//
//     // If end date inside 21 day range, no need to generate more
//     // So nextRepeatingInstance can be set to null
//     if (moment(endDate).isBefore(moment().add(21, 'days'))) {
//         return null
//     }
//
//     // Return next repeating instance of task
//     return rruleObj.after(_.last(taskDateInstances))
// }
//
// // If end date is equal to the last repeating instance => all of them are created
// // dont need more, return false
// const checkIfTasksMade = (task: TaskEntity) => {
//     const { id, endDate } = task
//
//     return getConnection()
//     .getRepository(RepeatingTaskInstanceEntity)
//     .createQueryBuilder('repeatingTaskInstance')
//     .where('repeatingTaskInstance.taskId = :taskId', { taskId: id })
//     .andWhere('repeatingTaskInstance.date = :endDate', { endDate })
//     .getOne()
// }
