import { AuthenticationError } from 'apollo-server'
import { verify } from 'jsonwebtoken'

export const verifyUserHandler = async (input) => {
    const { token } = input
    let user = {}

    // Check if token exists
    if (!token) {
        throw new AuthenticationError('Authentication Failed')
    }

    // Try to verify token
    await verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
        if (error) throw new AuthenticationError('Authentication Failed')

        user = {
            isUserAuthenticated: true,
            username: decodedToken.username,
        }
    })

    return user
}
