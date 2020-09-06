import gql from 'graphql-tag'

export const CREATE_CARD = gql`
    mutation createCard($input: CreateCardInput!) {
        createCard(input: $input) {
            card {
                id
                name
            }
        }
    }
`

export const EDIT_CARD = gql`
    mutation editCard($input: EditCardInput!) {
        editCard(input: $input) {
            card {
                id
                name
            }
        }
    }
`

export const DELETE_CARD = gql`
    mutation deleteCard($input: DeleteCardInput!) {
        deleteCard(input: $input) {
            id
        }
    }
`
