import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'
import { createReminderHandler } from './handlers/createReminder.handler'
import { getRemindersByDateHandler } from './handlers/getRemindersByDate.handler'

export const reminderResolver = {
    Query: {
        getRemindersByDate: (
            combineResolvers(
                (parent, input, context) => isAuthenticated(context),
                (parent, input) => getRemindersByDateHandler(input),
            )
        ),
    },
    Mutation: {
        createReminder: (
            combineResolvers(
                (parent, input, context) => isAuthenticated(context),
                (parent, input) => createReminderHandler(input),
            )
        ),
    },
}
