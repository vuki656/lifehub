import { gql } from "@apollo/client/core"

export const REMINDERS = gql`
    query Reminders($args: RemindersArgs!) {
        reminders(args: $args) {
            id
            title
            note
            dueDate
        }
    }
`
