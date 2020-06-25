import gql from 'graphql-tag'

export const CREATE_REMINDER = gql`
    mutation createReminder($input: CreateReminderInput!) {
        createReminder(input: $input) {
            reminder {
                id
                title
                description
                startDate
                endDate
                user {
                    id
                }
            }
        }
    }
`

export const UPDATE_REMINDER = gql`
    mutation updateReminder($id: String!, $title: String!, $description: String, $startDate: String!, $endDate: String!) {
        updateReminder(id: $id, title: $title, description: $description, startDate: $startDate, endDate: $endDate) {
            id
            title
            description
            startDate
            endDate
        }
    }
`

export const DELETE_REMINDER = gql`
    mutation deleteReminder($id: String!) {
        deleteReminder(id: $id) {
            id
        }
    }
`


