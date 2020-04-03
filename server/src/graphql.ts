import { ApolloServer } from 'apollo-server'
import { getRepository } from 'typeorm'
import { User } from './entity/User'

const typeDefs = `
  type User {
    id: ID!
    email: String!
    password: String!
  }

   type Mutation {
    addUser(name: String!, email: String!, password: String!): User
  }
`

const userType = `
  type User {
    id: ID!
    email: String!
    password: String!
  }

   type Mutation {
    addUser(name: String!, email: String!, password: String!): User
  }
`

const resolvers = {
    Query: {
        hello: (_: any, { name }: any) => `Hello ${name || 'World'}`,
    },
    Mutation: {
        // this is the addUser resolver
        addUser: (_: any, { id, email, password }: any) => {
            const user = new User()
            user.id = id
            user.email = email
            user.password = password
            return getRepository(User).save(user)
        },
    },
}

export const startGQLServer = () => {
    const port = 4000
    const server = new ApolloServer({ typeDefs, resolvers })

    server
        .listen({ port })
        .then(() => console.log(`Up on ${port}`))
}
