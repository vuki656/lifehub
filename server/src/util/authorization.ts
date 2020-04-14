import { AuthenticationError } from 'apollo-server'
import { verify } from 'jsonwebtoken'

// Check if user authenticated for request
// export const isAuthenticated = (context) => {
//     const { isUserAuthenticated } = context
//
//     return isUserAuthenticated
//         ? skip
//         : new ForbiddenError('Not authenticated as user.')
// }

// Mock implementation for registered user only action
// createTodo: combineResolvers(
//     (parent, input, context) => isAuthenticated(context), // Auth first
//     (parent, input, context) => createTodo(input, context), // Then create to do if auth passes
// ),

// Check if token is received and if its valid
export const verifyToken = async (req) => {
    const token = req.headers['x-token'] // Get token from header

    if (token) {
        try {
            return await verify(token, process.env.JWT_SECRET)
        } catch (error) {
            throw new AuthenticationError('Not Authenticated')
        }
    }
}
