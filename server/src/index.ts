import { GraphQLServer } from "graphql-yoga"
import "reflect-metadata"
import { createConnection, getRepository } from "typeorm"
import { User } from "./entity/User"

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
        hello: (_, { name }) => `Hello ${name || 'World'}`,
    },
    Mutation: {
        // this is the addUser resolver
        addUser: (_, { name, email }) => {
            const user = new User()
            user.email = email
            user.name = name
            return getRepository(User).save(user)
        },
    },

}

const server = new GraphQLServer({ typeDefs, resolvers })

createConnection().then(() => {
    server.start(() => console.log("Server is running on localhost:4000"))
}).catch(() => {
    console.log("Couldn't connect to the database.")
})
