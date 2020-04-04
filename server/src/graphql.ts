import { ApolloServer } from 'apollo-server'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'

export const startGQLServer = () => {
    const port = 4000
    const server = new ApolloServer({ typeDefs, resolvers })

    server
        .listen({ port })
        .then(() => console.log(`Up on ${port}`))
}
