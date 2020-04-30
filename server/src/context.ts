import { verifyToken } from './util/authorization'

export const context = async ({ req }) => {
    return ({
        secret: process.env.JWT_SECRET,
        isUserAuthenticated: await verifyToken(req),
    })
}
