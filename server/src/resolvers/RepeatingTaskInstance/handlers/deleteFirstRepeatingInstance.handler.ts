import { getConnection } from 'typeorm'

import { RepeatingTaskInstanceEntity } from '../../../entities/repeatingTaskInstance'

export const deleteFirstRepeatingTaskInstanceHandler = async (input) => {
    const { taskId } = input

    // Get first repeating instance
    const firstRepeatingInstance = await getConnection()
    .getRepository(RepeatingTaskInstanceEntity)
    .createQueryBuilder('repeatingTaskInstance')
    .where('repeatingTaskInstance.taskId = :taskId', { taskId })
    .orderBy('date', 'ASC')
    .limit(1)
    .getOne()

    // Delete first repeating instance
    await getConnection()
    .getRepository(RepeatingTaskInstanceEntity)
    .createQueryBuilder('repeatingTaskInstance')
    .delete()
    .whereInIds(firstRepeatingInstance?.id)

    return firstRepeatingInstance
}
