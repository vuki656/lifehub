import { gql } from "@apollo/client/core"

import { REMINDER_PAYLOAD } from "../fragements"

export const REMINDERS = gql`
    query Reminders($args: RemindersArgs!) {
        reminders(args: $args) {
            ...ReminderPayload
        }
    }
    ${REMINDER_PAYLOAD}
`
