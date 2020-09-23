import { gql } from "@apollo/client/core"

export const CREATE_REMINDER = gql`
    mutation CreateReminder($input: CreateReminderInput!) {
        createReminder(input: $input) {
            reminder {
                id
                title
                note
                dueDate
            }
        }
    }
`
