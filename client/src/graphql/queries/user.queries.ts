import gql from 'graphql-tag'

export const VERIFY_USER = gql`
    query verifyUser($token: String!) {
        verifyUser(token: $token)
    }
`
