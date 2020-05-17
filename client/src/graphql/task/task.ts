import { gql } from 'apollo-boost'

export const CREATE_TASK = gql`
    mutation createTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            task {
                id
                date
                isCompleted
                taskCardId
                taskMetaData {
                    title
                    note
                    id
                    startDate
                    endDate
                    rrule
                    isRepeating
                    isHabit
                    nextRepeatingInstance
                }
            }
        }
    }
`

export const GET_TASKS_BY_DATE_AND_TASK_CARD = gql`
    query getTasksByDateAndTaskCard($input: GetTasksByDateAndTaskCardInput!) {
        getTasksByDateAndTaskCard(input: $input) {
            tasks {
                id
                date
                isCompleted
                taskCardId
                taskMetaData {
                    id
                    title
                    note
                    startDate
                    endDate
                    rrule
                    isRepeating
                    isHabit
                    nextRepeatingInstance
                }
            }
        }
    }
`

export const TOGGLE_TASK_COMPLETED = gql`
    mutation toggleTaskCompleted($input: ToggleTaskCompletedInput!) {
        toggleTaskCompleted(input: $input)  {
            task {
                id
                date
                isCompleted
                taskCardId
                taskMetaData {
                    id
                    title
                    note
                    startDate
                    endDate
                    rrule
                    isRepeating
                    isHabit
                    nextRepeatingInstance
                }
            }
        }
    }
`

export const UPDATE_TASK = gql`
    mutation updateTask($input: UpdateTaskInput!) {
        updateTask(input: $input) {
            task {
                id
                date
                isCompleted
                taskCardId
                taskMetaData {
                    id
                    title
                    note
                    startDate
                    endDate
                    rrule
                    isRepeating
                    isHabit
                    nextRepeatingInstance
                }
            }
        }
    }
`
