import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { skip } from 'graphql-resolvers'
import { verify } from 'jsonwebtoken'

// Check if user authenticated for request
export const isAuthenticated = (context) => {
    const { me } = context

    return me ? skip : new ForbiddenError('Not authenticated as user.')
}

// Mock implementation for registered user only action
// createTodo: combineResolvers(
//     (parent, input, context) => isAuthenticated(context), // Auth first
//     (parent, input, context) => createTodo(input, context), // Then create to do if auth passes
// ),

// Check if token is sent and if its valid
export const getMe = async (req) => {
    const token = req.headers['x-token'] // Get token from header

    if (token) {
        try {
            return await verify(token, process.env.JWT_SECRET)
        } catch (error) {
            throw new AuthenticationError('Your session expired. Sign in again.')
        }
    }
}
