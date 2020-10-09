import { gql } from "@apollo/client/core"

import { REMINDER_PAYLOAD } from "../fragements"

export const CREATE_REMINDER = gql`
    mutation CreateReminder($input: CreateReminderInput!) {
        createReminder(input: $input) {
            reminder {
                ...ReminderPayload
            }        
        }
    }
    ${REMINDER_PAYLOAD}
`

export const EDIT_REMINDER = gql`
    mutation EditReminder($input: EditReminderInput!) {
        editReminder(input: $input) {
            reminder {
                ...ReminderPayload
            }
        }
    }
    ${REMINDER_PAYLOAD}
`

export const DELETE_REMINDER = gql`
    mutation DeleteReminder($id: String!) {
        deleteReminder(id: $id) {
            id
        }
    }
`
