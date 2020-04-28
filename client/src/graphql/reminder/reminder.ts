import { gql } from 'apollo-boost'

export const CREATE_REMINDER = gql`
    mutation createReminder($title: String!, $description: String, $username: String!, $startDate: String!, $endDate: String!) {
        createReminder(title: $title, description: $description, username: $username, startDate: $startDate, endDate: $endDate) {
            title
            description
            startDate
            endDate
        }
    }
`

export const GET_REMINDERS_BY_DATE = gql`
    query getRemindersByDate($username: String!, $selectedDate: String!) {
        getRemindersByDate(username: $username, selectedDate: $selectedDate) {
            title
            description
            startDate
            endDate
        }
    }
`
