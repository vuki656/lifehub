import { gql } from 'apollo-boost'

export const CREATE_REMINDER = gql`
    mutation createReminder($title: String!, $description: String, $username: String!, $start: String!, $end: String!) {
        createReminder(title: $title, description: $description, username: $username, start: $start, end: $end) {
            title
            description
            start
            end
        }
    }
`
