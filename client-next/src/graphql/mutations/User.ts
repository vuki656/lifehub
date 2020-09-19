import { gql } from '@apollo/client/core'

export const REGISTER_USER = gql`
    mutation registerUser($input: RegisterUserInput!) {
        registerUser(input: $input) {
            token
            userId
        }
    }
`

export const LOGIN_USER = gql`
    mutation logInUser($input: LogInUserInput!) {
        logInUser(input: $input) {
            token
            userId
        }
    }
`
