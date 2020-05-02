import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'
import { createTaskHandler } from './handlers/createTask.handler'
import { getTasksByDateAndTaskCardHandler } from './handlers/getTasksByDateAndTaskCard.handler'

export const taskResolver = {
    Query: {
        getTasksByDateAndTaskCard: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => getTasksByDateAndTaskCardHandler(input),
        ),
    },
    Mutation: {
        createTask: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => createTaskHandler(input),
        ),
    },
}
