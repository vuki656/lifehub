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

const server = new ApolloServer({ typeDefs, resolvers })

createTypeORMConnection().then(() => {
    server.listen({ port: 4000 }).then(() => {
        console.log('Server is running on http://localhost:4000/graphql')
    })
}).catch((err) => {
    console.error(err)
})
