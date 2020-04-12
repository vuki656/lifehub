import { getMe } from './util/authorization'

export const context = async ({ req }) => ({
    secret: process.env.JWT_SECRET,
    me: await getMe(req),
})
