import { gql } from 'apollo-boost'

export const CREATE_TASK_CARD = gql`
    mutation createTaskCard($name: String!, $username: String!) {
        createTaskCard(name: $name, username: $username) {
            id
            name
        }
    }
`

export const UPDATE_TASK_CARD = gql`
    mutation updateTaskCard($name: String, $id: String!) {
        updateTaskCard(name: $name, id: $id) {
            id
            name
        }
    }
`

export const GET_ALL_TASK_CARDS = gql`
    query getAllTaskCards($username: String!) {
        getAllTaskCards(username: $username) {
            id
            name
        }
    }
`
