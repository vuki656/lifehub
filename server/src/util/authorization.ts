import {
    AuthenticationError,
    ForbiddenError,
} from 'apollo-server'
import { skip } from 'graphql-resolvers'
import { verify } from 'jsonwebtoken'

// Check if user authenticated for request
export const isAuthenticated = (context) => {
    const { isUserAuthenticated } = context

    return isUserAuthenticated
        ? skip
        : new ForbiddenError('Not authenticated as user.')
}

// Check if token is received and if its valid
export const verifyToken = async (req) => {
    if (req.headers.authorization !== 'null') {
        const token = req.headers.authorization

        try {
            return await verify(token, process.env.JWT_SECRET)
        } catch (error) {
            throw new AuthenticationError('Not Authenticated')
        }
    }
}
