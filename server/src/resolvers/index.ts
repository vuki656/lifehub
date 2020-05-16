import { GraphQLDateTime } from 'graphql-iso-date'

import { reminderResolver } from './Reminder/reminder.resolver'
import { taskResolver } from './Task/task.resolver'
import { taskCardResolver } from './TaskCard/taskCard.resolver'
import { userResolver } from './User/user.resolver'

export const resolvers = [
    userResolver,
    reminderResolver,
    taskResolver,
    taskCardResolver,

    // Custom scalars
    { GraphQLDateTime },
]
