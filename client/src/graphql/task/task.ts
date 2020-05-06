import { gql } from 'apollo-boost'

export const CREATE_TASK = gql`
    mutation createTask($title: String!, $note: String!, $checked: Boolean!, $date: String!, $rrule: String, $isRepeating: Boolean!, $taskCardId: String!, $username: String!) {
        createTask(title: $title, note: $note, checked: $checked, date: $date, rrule: $rrule, isRepeating: $isRepeating, taskCardId: $taskCardId, username: $username) {
            id
            title
            note
            checked
            date
            rrule
            endDate
            isRepeating
            taskCardId
        }
    }
`

export const UPDATE_TASK = gql`
    mutation updateTask($id: String!, $checked: Boolean, $title: String, $note: String, $date: String, $endDate: String, $rrule: String, $isRepeating: Boolean) {
        updateTask(id: $id, title: $title, checked: $checked, note: $note, date: $date, endDate: $endDate, rrule: $rrule, isRepeating: $isRepeating) {
            id
            title
            note
            checked
            date
            rrule
            endDate
            isRepeating
            taskCardId
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

export const GET_TASKS_BY_DATE_AND_TASK_CARD = gql`
    query getTasksByDateAndTaskCard($taskCardId: String!, $selectedDate: String!) {
        getTasksByDateAndTaskCard(taskCardId: $taskCardId, selectedDate: $selectedDate) {
            id
            title
            note
            checked
            date
            rrule
            isRepeating
            endDate
        }
    }
`
