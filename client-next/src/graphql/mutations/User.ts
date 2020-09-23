import { gql } from '@apollo/client/core'

export const REGISTER_USER = gql`
    mutation RegisterUser($input: RegisterUserInput!) {
        registerUser(input: $input) {
            token
            userId
        }
    }
`

export const LOGIN_USER = gql`
    mutation LogInUser($input: LogInUserInput!) {
        logInUser(input: $input) {
            token
            userId
        }
    }
`
