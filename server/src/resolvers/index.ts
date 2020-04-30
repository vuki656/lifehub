import { GraphQLDateTime } from 'graphql-iso-date'

import { reminderResolver } from './Reminder/reminder.resolver'
import { taskResolver } from './Task/task.resolver'
import { userResolver } from './User/user.resolver'

export const resolvers = [
    userResolver,
    reminderResolver,
    taskResolver,

    // Custom scalars
    { GraphQLDateTime },
]
