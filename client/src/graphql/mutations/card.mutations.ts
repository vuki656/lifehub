import gql from 'graphql-tag'

export const CREATE_TASK_CARD = gql`
    #    mutation createTaskCard($name: String!, $username: String!) {
    #        createTaskCard(name: $name, username: $username) {
    #            id
    #            name
    #        }
    #    }
`

export const UPDATE_TASK_CARD = gql`
    #    mutation updateTaskCard($name: String, $id: String!) {
    #        updateTaskCard(name: $name, id: $id) {
    #            id
    #            name
    #        }
    #    }
`

export const DELETE_TASK_CARD = gql`
    #    mutation deleteTaskCard($id: String!) {
    #        deleteTaskCard(id: $id) {
    #            id
    #        }
    #    }
`
