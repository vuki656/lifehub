require('dotenv').config()
import { ApolloServer } from 'apollo-server'
import 'reflect-metadata'
import { getRepository } from 'typeorm'
import { User } from './entity/User'
import { createTypeORMConnection } from './typeorm'

const typeDefs = `
  type Query {
    hello(name: String): String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

   type Mutation {
    addUser(name: String!, email: String!): User
  }
`

const resolvers = {
    Query: {
        hello: (_: any, { name }: any) => `Hello ${name || 'World'}`,
    },
    Mutation: {
        // this is the addUser resolver
        addUser: (_: any, { name, email }: any) => {
            const user = new User()
            user.email = email
            user.name = name
            return getRepository(User).save(user)
        },
    },
}

const server = new ApolloServer({ typeDefs, resolvers })

createTypeORMConnection().then(() => {
    server.listen({ port: 4000 }).then(() => {
        console.log('Server is running on http://localhost:4000/graphql')
    })
}).catch((err) => {
    console.error(err)
})
