import { gql } from 'apollo-boost'

export const CREATE_TASK = gql`
    mutation createTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            task {
                id
                date
                isCompleted
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
                    taskCard {
                        id
                    }
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
                    taskCard {
                        id
                    }
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
                    taskCard {
                        id
                    }
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
                    taskCard {
                        id
                    }
                }
            }
        }
    }
`

export const DELETE_TASK = gql`
    mutation deleteTask($input: DeleteTaskInput!) {
        deleteTask(input: $input) {
            taskId
        }
    }
`

export const DELETE_SINGLE_TASK_INSTANCE = gql`
    mutation deleteSingleTaskInstance($input: DeleteSingleTaskInstanceInput!) {
        deleteSingleTaskInstance(input: $input) {
            taskId
        }
    }
`

export const DELETE_ALL_TASKS_AND_META_DATA = gql`
    mutation deleteAllTasksAndMetaData($input: DeleteAllTasksAndMetaDataInput!) {
        deleteAllTasksAndMetaData(input: $input) {
            taskMetaDataId
        }
    }
`

export const TURN_OFF_REPEATING = gql`
    mutation turnOffRepeating($input: TurnOffRepeatingInput!) {
        turnOffRepeating(input: $input)
    }
`
