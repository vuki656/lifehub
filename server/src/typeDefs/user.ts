import { gql } from 'apollo-server'

export const userType = gql`
    type Query {
        getUsers: User!
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
