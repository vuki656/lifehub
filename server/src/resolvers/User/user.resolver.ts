import { createUserHandler } from './handlers/createUser.handler'
import { logInUserHandler } from './handlers/logInUser.handler'
import { verifyUserHandler } from './handlers/verifyUser.handler'

export const userResolver = {
    Mutation: {
        createUser: (parent, input, context) => createUserHandler(input, context),
        logInUser: (parent, input, context) => logInUserHandler(input, context), // Mutation bcz apollo query doesn't support callbacks yet
    },
    Query: { verifyUser: (parent, input) => verifyUserHandler(input) },
}
