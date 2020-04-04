import { gql } from 'apollo-server'

export const userType = gql`
    type Query {
        getUsers: [User]!
    }

    type User {
        id: ID!
        email: String!
        username: String!
        password: String!
    }


    type Mutation {
        addUser(email: String!, username: String!, password: String!): User
    }
`
