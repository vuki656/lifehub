import { createUserHandler } from './handlers/createUserHandler'
import { getAllUsersHandler } from './handlers/getAllUsersHandler'
import { logInUserHandler } from './handlers/logInUserHandler'

export const userResolver = {
    Query: {
        getAllUsers: () => getAllUsersHandler(),
    },

    Mutation: {
        createUser: (parent, input) => createUserHandler(input),
        logInUser: (parent, input, context) => logInUserHandler(input, context), // Mutation bcz apollo query doesn't support callbacks yet
    },
}
