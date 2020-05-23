import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'
import { createTaskHandler } from './handlers/createTask.handler'
import { deleteTaskHandler } from './handlers/deleteTask.handler'
import { getTasksByDateAndTaskCardHandler } from './handlers/getTasksByDateAndTaskCard.handler'
import { toggleTaskCompletedHandler } from './handlers/toggleTaskCompleted.handler'
import { updateTaskHandler } from './handlers/updateTask.handler'

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
        toggleTaskCompleted: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => toggleTaskCompletedHandler(input),
        ),
        updateTask: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => updateTaskHandler(input),
        ),
        deleteTask: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => deleteTaskHandler(input),
        ),
    },
}
