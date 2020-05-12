import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'
import { deleteFirstRepeatingTaskInstanceHandler } from './handlers/deleteFirstRepeatingInstance.handler'
import { deleteRepeatingTaskInstanceHandler } from './handlers/deleteRepeatingTaskInstance.handler'
import { updateRepeatingTaskInstanceHandler } from './handlers/updateRepeatingTaskInstance.handler'

export const repeatingTaskInstanceResolver = {
    Mutation: {
        updateRepeatingTaskInstance: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => updateRepeatingTaskInstanceHandler(input),
        ),
        deleteRepeatingTaskInstance: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => deleteRepeatingTaskInstanceHandler(input),
        ),
        deleteFirstRepeatingTaskInstance: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => deleteFirstRepeatingTaskInstanceHandler(input),
        ),
    },
}
