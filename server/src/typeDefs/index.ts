import { reminderType } from './reminder.typeDef'
import { repeatingTaskInstanceType } from './repeatingTaskInstance.typeDef'
import { rootType } from './root.typeDef'
import { taskType } from './task.typeDef'
import { taskCardType } from './taskCard.typeDef'
import { userType } from './user.typeDef'

export const typeDefs = [
    rootType,
    userType,
    reminderType,
    taskType,
    taskCardType,
    repeatingTaskInstanceType,
]
