import { gql } from '@apollo/client/core'

export const VERIFY_USER = gql`
    query verifyUser($token: String!) {
        verifyUser(token: $token) {
            id
            username
            email
        }
    }
`
