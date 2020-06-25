import gql from 'graphql-tag'

export const REGISTER_USER = gql`
    mutation registerUser($input: RegisterUserInput!) {
        registerUser(input: $input) {
            token
            user {
                id
                username
                email
            }
        }
    }
`

export const LOGIN_USER = gql``
