import { gql } from 'apollo-boost'

export const CREATE_REMINDER = gql`
    mutation createReminder($title: String!, $description: String, $username: String!, $startDate: String!, $endDate: String!) {
        createReminder(title: $title, description: $description, username: $username, startDate: $startDate, endDate: $endDate) {
            id
            title
            description
            startDate
            endDate
        }
    }
`

export const UPDATE_REMINDER = gql`
    mutation updateReminder($id: String!, $title: String!, $description: String, $startDate: Float!, $endDate: Float!) {
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

export const GET_REMINDERS_BY_DATE = gql`
    query getRemindersByDate($username: String!, $selectedDate: String!) {
        getRemindersByDate(username: $username, selectedDate: $selectedDate) {
            id
            title
            description
            startDate
            endDate
        }
    }
`
