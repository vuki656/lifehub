import { gql } from '@apollo/client/core'

export const REMINDER_PAYLOAD = gql`
    fragment ReminderPayload on ReminderType {
        id
        title
        note
        dueDate
    }
`
