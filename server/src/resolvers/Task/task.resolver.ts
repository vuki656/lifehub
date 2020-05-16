import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'
import { createTaskHandler } from './handlers/createTask.handler'

export const taskResolver = {
    Mutation: {
        createTask: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => createTaskHandler(input),
        ),
    },
}
