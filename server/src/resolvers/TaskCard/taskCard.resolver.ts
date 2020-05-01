import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'
import { createTaskCardHandler } from './handlers/createTaskCard.handler'
import { getAllTaskCardsHandler } from './handlers/getAllTaskCards.handler'
import { updateTaskCardHandler } from './handlers/updateTaskCard.handler'

export const taskCardResolver = {
    Query: {
        getAllTaskCards: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => getAllTaskCardsHandler(input),
        ),
    },
    Mutation: {
        createTaskCard: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => createTaskCardHandler(input),
        ),
        updateTaskCard: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => updateTaskCardHandler(input),
        ),
    },
}
