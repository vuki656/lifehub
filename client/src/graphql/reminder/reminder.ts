import { gql } from 'apollo-boost'

export const CREATE_REMINDER = gql`
    mutation createReminder($title: String!, $description: String, $username: String!) {
        createReminder(title: $title, description: $description, username: $username) {
            title
            description
        }
    }
`
