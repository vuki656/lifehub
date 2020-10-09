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

export const TOGGLE_TASK = gql`
    mutation ToggleTask($input: ToggleTaskInput!) {
        toggleTask(input: $input) {
            id
            isCompleted
        }
    }
`
