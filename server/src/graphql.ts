import { ApolloServer } from 'apollo-server'

import { context } from './context'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { generateRepeatingTaskInstancesCRON } from './util/taskCRON'

export const startGQLServer = () => {
    const port = 4000
    const server = new ApolloServer({
        context,
        resolvers,
        typeDefs,
    })

    server
    .listen({ port })
    .then(() => console.log(`===== UP ON ${port} =====`))

    generateRepeatingTaskInstancesCRON.start()
}
