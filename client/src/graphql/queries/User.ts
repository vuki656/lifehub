import { gql } from '@apollo/client/core'

export const VERIFY_USER = gql`
    query VerifyUser($token: String!) {
        verifyUser(token: $token) {
            id
            username
            email
        }
    }
`
