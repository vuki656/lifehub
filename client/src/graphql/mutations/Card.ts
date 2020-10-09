import { gql } from "@apollo/client/core"

import { CARD_PAYLOAD } from "../fragements"

export const CREATE_CARD = gql`
    mutation CreateCard($input: CreateCardInput!) {
        createCard(input: $input) {
            card {
                ...CardPayload
            }
        }
    }
    ${CARD_PAYLOAD}
`

export const DELETE_CARD = gql`
    mutation DeleteCard($input: DeleteCardInput!) {
        deleteCard(input: $input) {
            id
        }
    }
`

export const EDIT_CARD = gql`
    mutation EditCard($input: EditCardInput!) {
        editCard(input: $input) {
            card {
                ...CardPayload
            }
        }
    }
    ${CARD_PAYLOAD}
`
