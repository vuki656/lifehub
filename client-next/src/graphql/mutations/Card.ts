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
