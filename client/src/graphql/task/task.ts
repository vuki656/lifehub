import { gql } from 'apollo-boost'

export const CREATE_TASK = gql`
    mutation createTask($title: String!, $checked: Boolean!, $date: String!, $taskCardId: String!, $username: String!) {
        createTask(title: $title, checked: $checked, date: $date, taskCardId: $taskCardId, username: $username) {
            id
            title
            checked
            date
            taskCardId
        }
    }
`

export const GET_TASKS_BY_DATE_AND_TASK_CARD = gql`
    query getTasksByDateAndTaskCard($taskCardId: String!, $selectedDate: String!) {
        getTasksByDateAndTaskCard(taskCardId: $taskCardId, selectedDate: $selectedDate) {
            id
            title
            checked
            date
        }
    }
`
