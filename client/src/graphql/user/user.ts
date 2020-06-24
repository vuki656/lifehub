import gql from 'graphql-tag'

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        createUser(username: $username, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
            token
        }
    }
`

export const LOGIN_USER = gql`
    mutation logInUser($email: String!, $password: String!) {
        logInUser(email: $email, password: $password) {
            token
            user {
                id
                email
                username
            }
        }
    }
`

export const VERIFY_USER = gql`
    query verifyUser($token: String!) {
        verifyUser(token: $token) {
            isUserAuthenticated,
            username
        }
    }
`
