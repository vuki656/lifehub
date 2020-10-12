import { gql } from '@apollo/client/core'

import { TASK_PAYLOAD } from '../fragements'

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

export const DELETE_TASK = gql`
    mutation DeleteTask($input: DeleteTaskInput!) {
        deleteTask(input: $input) {
            id
        }
    }
`

export const EDIT_TASK = gql`
    mutation EditTask($input: EditTaskInput!) {
        editTask(input: $input) {
            task {
                ...TaskPayload
            }
        }
    }
    ${TASK_PAYLOAD}
`

export const MOVE_TASK_TO_TODAY = gql`
    mutation MoveTaskToToday($input: MoveTaskToTodayInput!) {
        moveTaskToToday(input: $input) {
            id
        }
    }
`

export const EDIT_TASK_SEQUENCE = gql`
    mutation EditTaskSequence($input: [EditTaskSequenceInput!]!) {
        editTaskSequence(input: $input) {
            id
            sequenceNumber
        }
    }
`
