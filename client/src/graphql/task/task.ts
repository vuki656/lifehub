import { gql } from 'apollo-boost'

export const CREATE_TASK = gql`
    mutation createTask($title: String!,$username: String!) {
        createTask(title: $title, username: $username) {
            id
            title
        }
    }
`
