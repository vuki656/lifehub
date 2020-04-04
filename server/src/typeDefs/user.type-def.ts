import { gql } from 'apollo-server'

export const userType = gql`
    type Query {
        getAllUsers: [User]!
    }

    type User {
        id: ID!
        email: String!
        username: String!
        password: String!
    }


    type Mutation {
        createUser(email: String!, username: String!, password: String!): User
    }
`
