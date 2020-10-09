import { ApolloServer } from 'apollo-server'

import { getSchema } from './schema'

export const startServer = async(): Promise<void> => {
    const port = 4000
    const server = new ApolloServer({
        context: ({ req }) => {
            return {
                secret: process.env.JWT_SECRET,
                token: req.headers.token,
                userId: req.headers.userid,
            }
        },
        schema: await getSchema(),
    })

    server
    .listen({ port })
    .then(() => {
        // eslint-disable-next-line no-console
        console.log(`======== UP ON ${port} ========`)
    })
}
