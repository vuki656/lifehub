import { verifyToken } from './util/authorization'

export const context = async ({ req }) => ({
    secret: process.env.JWT_SECRET,
    isUserAuthenticated: await verifyToken(req),
})
