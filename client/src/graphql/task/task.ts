import { gql } from 'apollo-boost'

export const CREATE_TASK = gql`
    mutation createTask($input: TaskInput!) {
        createTask(input: $input) {
            task {
                id
                title
                note
                date
                isCompleted
                taskCardId
                taskMetaData {
                    id
                    startDate
                    endDate
                    rrule
                    isRepeating
                    isHabbit
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
                title
                note
                date
                isCompleted
                taskCardId
                taskMetaData {
                    id
                    startDate
                    endDate
                    rrule
                    isRepeating
                    isHabbit
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
                title
                note
                date
                isCompleted
                taskCardId
                taskMetaData {
                    id
                    startDate
                    endDate
                    rrule
                    isRepeating
                    isHabbit
                    nextRepeatingInstance
                }
            }
        }
    }
`
