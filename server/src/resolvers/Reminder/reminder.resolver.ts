import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated } from '../../util/authorization'
import { createReminderHandler } from './handlers/createReminder.handler'
import { getAllRemindersHandler } from './handlers/getAllReminders.handler'

export const reminderResolver = {
    Query: {
        getAllReminders: (combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            () => getAllRemindersHandler(),
        )),
    },
    Mutation: {
        createReminder: (combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => createReminderHandler(input),
        )),
    },
}
