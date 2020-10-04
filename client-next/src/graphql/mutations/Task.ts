import { gql } from "@apollo/client/core"

import { TASK_PAYLOAD } from "../fragements"

export const CREATE_TASK = gql`
    mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            task {
                ...TaskPayload
            }
        }
    }
    ${TASK_PAYLOAD}
`
