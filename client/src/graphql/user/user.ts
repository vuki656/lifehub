import { gql } from 'apollo-boost'

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
        createUser(username: $username, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
            id
            username
            email
            password,
        }
    }
`

export const LOGIN_USER = gql`
    mutation logInUser($email: String!, $password: String!) {
        logInUser(email: $email, password: $password) {
            token
        }
    }
`
