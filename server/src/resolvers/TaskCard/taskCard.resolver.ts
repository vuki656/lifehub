import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'

import { createTaskCardHandler } from './handlers/createTaskCard.handler'
import { deleteTaskCardHandler } from './handlers/deleteTaskCard.handler'
import { getAllTaskCardsHandler } from './handlers/getAllTaskCards.handler'
import { updateTaskCardHandler } from './handlers/updateTaskCard.handler'

export const taskCardResolver = {
    Mutation: {
        createTaskCard: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => createTaskCardHandler(input),
        ),
        deleteTaskCard: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => deleteTaskCardHandler(input),
        ),
        updateTaskCard: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => updateTaskCardHandler(input),
        ),
    },
    Query: {
        getAllTaskCards: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => getAllTaskCardsHandler(input),
        ),
    },
}
