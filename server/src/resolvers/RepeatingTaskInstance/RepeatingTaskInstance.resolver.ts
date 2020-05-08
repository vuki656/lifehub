import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'
import { updateRepeatingTaskInstanceHandler } from './handlers/updateRepeatingTaskInstance.handler'

export const repeatingTaskInstanceResolver = {
    Mutation: {
        updateRepeatingTaskInstance: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => updateRepeatingTaskInstanceHandler(input),
        ),
    },
}
