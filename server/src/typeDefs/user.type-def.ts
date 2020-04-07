import { gql } from 'apollo-server'

export const userType = gql`
    type User {
        id: ID!
        email: String!
        username: String!
        password: String!
    }

    type Query {
        getAllUsers: [User]!
    }

    type Mutation {
        createUser(email: String!, username: String!, password: String!): User
    }

`
