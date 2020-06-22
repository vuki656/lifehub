import { ApolloServer } from 'apollo-server'

import { getSchema } from './schema'

export const startServer = async (): Promise<void> => {
    const port = 4000
    const server = new ApolloServer({
        context: ({ req }) => ({
            secret: process.env.JWT_SECRET,
            token: req.headers.token,
            user: req.headers.user,
        }),
        schema: await getSchema(),
    })

    server
        .listen({ port })
        .then(() => console.log(`===== UP ON ${port} =====`))
}
