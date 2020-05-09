import { ApolloServer } from 'apollo-server'

import { context } from './context'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { generateRepeatingTaskInstancesCRON } from './util/generateRepeatingTaskInstancesCRON'

export const startGQLServer = () => {
    const port = 4000
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context,
    })

    server
    .listen({ port })
    .then(() => console.log(`===== UP ON ${port} =====`))

    generateRepeatingTaskInstancesCRON()
}
