import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'
import { createTaskCardHandler } from './handlers/createTaskCard.handler'
import { getAllTaskCardsHandler } from './handlers/getAllTaskCards.handler'

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
    },
}
