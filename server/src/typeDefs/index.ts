import { DocumentNode } from 'graphql'

import { reminderType } from './reminder.typeDef'
import { rootType } from './root.typeDef'
import { taskType } from './task.typeDef'
import { taskCardType } from './taskCard.typeDef'
import { taskMetaDataType } from './taskMetaData.typeDef'
import { userType } from './user.typeDef'

export const typeDefs: DocumentNode[] = [
    rootType,
    userType,
    reminderType,
    taskType,
    taskCardType,
    taskMetaDataType,
]
