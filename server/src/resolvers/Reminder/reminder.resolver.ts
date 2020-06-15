import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'

import { createReminderHandler } from './handlers/createReminder.handler'
import { deleteReminderHandler } from './handlers/deleteReminder.handler'
import { getRemindersByDateHandler } from './handlers/getRemindersByDate.handler'
import { updateReminderHandler } from './handlers/updateReminder.handler'

export const reminderResolver = {
    Mutation: {
        createReminder: (
            combineResolvers(
                (parent, input, context) => isAuthenticated(context),
                (parent, { input }) => createReminderHandler(input),
            )
        ),
        deleteReminder: (
            combineResolvers(
                (parent, input, context) => isAuthenticated(context),
                (parent, input) => deleteReminderHandler(input),
            )
        ),
        updateReminder: (
            combineResolvers(
                (parent, input, context) => isAuthenticated(context),
                (parent, input) => updateReminderHandler(input),
            )
        ),
    },
    Query: {
        getRemindersByDate: (
            combineResolvers(
                (parent, input, context) => isAuthenticated(context),
                (parent, input) => getRemindersByDateHandler(input),
            )
        ),
    },
}
