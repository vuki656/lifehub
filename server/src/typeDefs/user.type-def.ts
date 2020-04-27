import { gql } from 'apollo-server'

export const userType = gql`
    type User {
        id: ID!
        email: String!
        username: String!
        password: String!
    }

    type UserAuth {
        token: String!
    }

    type AuthResponse {
        isUserAuthenticated: Boolean!
        username: String!
    }

    extend type Query {
        getAllUsers: [User]!
        verifyUser(token: String): AuthResponse
    }

    extend type Mutation {
        createUser(email: String!, username: String!, password: String!, passwordConfirmation: String!): UserAuth!
        logInUser(email: String!, password: String!): UserAuth!
    }
`
