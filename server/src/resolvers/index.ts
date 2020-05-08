import { GraphQLDateTime } from 'graphql-iso-date'

import { reminderResolver } from './Reminder/reminder.resolver'
import { repeatingTaskInstanceResolver } from './RepeatingTaskInstance/RepeatingTaskInstance.resolver'
import { taskResolver } from './Task/task.resolver'
import { taskCardResolver } from './TaskCard/taskCard.resolver'
import { userResolver } from './User/user.resolver'

export const resolvers = [
    userResolver,
    reminderResolver,
    taskResolver,
    taskCardResolver,
    repeatingTaskInstanceResolver,

    // Custom scalars
    { GraphQLDateTime },
]
