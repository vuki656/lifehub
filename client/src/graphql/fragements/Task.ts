import { gql } from "@apollo/client/core"

export const TASK_PAYLOAD = gql`
    fragment TaskPayload on TaskType {
        id
        title
        note
        date
        isCompleted
    }
`
