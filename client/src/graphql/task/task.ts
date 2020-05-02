import { gql } from 'apollo-boost'

export const CREATE_TASK = gql`
    mutation createTask($title: String!, $note: String!, $checked: Boolean!, $date: String!, $taskCardId: String!, $username: String!) {
        createTask(title: $title, note: $note, checked: $checked, date: $date, taskCardId: $taskCardId, username: $username) {
            id
            title
            note
            checked
            date
            taskCardId
        }
    }
`

export const UPDATE_TASK = gql`
    mutation updateTask($id: String!, $title: String, $note: String, $date: String) {
        updateTask(id: $id, title: $title, note: $note, date: $date) {
            id
            title
            note
            date
        }
    }
`

export const DELETE_TASK = gql`
    mutation deleteTask($id: String!) {
        deleteTask(id: $id) {
            id
        }
    }
`

export const TOGGLE_TASK = gql`
    mutation toggleTask($id: String!, $checked: Boolean!) {
        toggleTask(id: $id, checked: $checked) {
            id
            title
            note
            date
            checked
            taskCardId
        }
    }
`

export const GET_TASKS_BY_DATE_AND_TASK_CARD = gql`
    query getTasksByDateAndTaskCard($taskCardId: String!, $selectedDate: String!) {
        getTasksByDateAndTaskCard(taskCardId: $taskCardId, selectedDate: $selectedDate) {
            id
            title
            note
            checked
            date
        }
    }
`
