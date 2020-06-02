import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated } from '../../util/authorization'

import { createTaskHandler } from './handlers/createTask.handler'
import { deleteAllTasksAndMetaDataHandler } from './handlers/deleteAllTasksAndMetaData.handler'
import { deleteSingleTaskInstanceHandler } from './handlers/deleteSingleTaskInstance.handler'
import { deleteTaskHandler } from './handlers/deleteTask.handler'
import { getTasksByDateAndTaskCardHandler } from './handlers/getTasksByDateAndTaskCard.handler'
import { toggleTaskCompletedHandler } from './handlers/toggleTaskCompleted.handler'
import { turnOffRepeatingHandler } from './handlers/turnOffRepeating.handler'
import { updateTaskHandler } from './handlers/updateTask.handler'

export const taskResolver = {
    Mutation: {
        createTask: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => createTaskHandler(input),
        ),
        deleteAllTasksAndMetaData: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => deleteAllTasksAndMetaDataHandler(input),
        ),
        deleteSingleTaskInstance: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => deleteSingleTaskInstanceHandler(input),
        ),
        deleteTask: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => deleteTaskHandler(input),
        ),
        toggleTaskCompleted: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => toggleTaskCompletedHandler(input),
        ),
        turnOffRepeating: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => turnOffRepeatingHandler(input),
        ),
        updateTask: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => updateTaskHandler(input),
        ),
    },
    Query: {
        getTasksByDateAndTaskCard: combineResolvers(
            (parent, input, context) => isAuthenticated(context),
            (parent, input) => getTasksByDateAndTaskCardHandler(input),
        ),
    },
}
