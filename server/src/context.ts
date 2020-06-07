import { verifyToken } from './util/authorization'

export const context = async ({ req }) => {
    return ({
        isUserAuthenticated: await verifyToken(req),
        secret: process.env.JWT_SECRET,
    })
}
