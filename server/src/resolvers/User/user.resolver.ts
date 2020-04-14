import { createUserHandler } from './handlers/createUserHandler'
import { getAllUsersHandler } from './handlers/getAllUsersHandler'
import { logInUserHandler } from './handlers/logInUserHandler'
import { verifyUserHandler } from './handlers/verifyUserHandler'

export const userResolver = {
    Query: {
        getAllUsers: () => getAllUsersHandler(),
        verifyUser: (parent, input) => verifyUserHandler(input),
    },

    Mutation: {
        createUser: (parent, input, context) => createUserHandler(input, context),
        logInUser: (parent, input, context) => logInUserHandler(input, context), // Mutation bcz apollo query doesn't support callbacks yet
    },
}
