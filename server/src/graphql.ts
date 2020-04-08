import { ApolloServer } from 'apollo-server'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'

export const startGQLServer = () => {
    const port = 4000
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async () => ({
            secret: process.env.JWT_SECRET,
        }),
    })

    server
    .listen({ port })
    .then(() => console.log(`===== UP ON ${port} =====`))
}
