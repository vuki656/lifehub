import { gql } from 'apollo-boost'

export const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            id
            username
            email
            password
        }
    }
`
