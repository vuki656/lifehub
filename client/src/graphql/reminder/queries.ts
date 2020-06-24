import gql from 'graphql-tag'

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
