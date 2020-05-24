import { GraphQLDate } from 'graphql-iso-date'
import { IResolvers } from 'graphql-tools'

import { reminderResolver } from './Reminder/reminder.resolver'
import { taskResolver } from './Task/task.resolver'
import { taskCardResolver } from './TaskCard/taskCard.resolver'
import { userResolver } from './User/user.resolver'

export const resolvers: IResolvers[] = [
    userResolver,
    reminderResolver,
    taskResolver,
    taskCardResolver,

    // Custom scalars
    {
        GraphQLDate,
    },
]
