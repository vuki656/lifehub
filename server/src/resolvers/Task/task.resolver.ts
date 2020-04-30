import { createTaskHandler } from './handlers/createTask.handler'

export const taskResolver = {
    // Query: {
    // },
    Mutation: {
        createTask: (parent, input) => createTaskHandler(input),
    },
}
