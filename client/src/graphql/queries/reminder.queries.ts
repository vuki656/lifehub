import gql from 'graphql-tag'

export const REMINDERS_BY_DATE = gql`
    query remindersByDate($date: Date!) {
        remindersByDate(date: $date) {
            id
            title
            note
            startDate
            endDate
        }
    }
`
