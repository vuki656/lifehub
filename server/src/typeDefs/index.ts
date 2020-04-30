import { reminderType } from './reminder.type-def'
import { rootType } from './root.type-def'
import { taskType } from './task.type-def'
import { userType } from './user.type-def'

export const typeDefs = [
    rootType,
    userType,
    reminderType,
    taskType,
]
