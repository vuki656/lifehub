import { gql } from "@apollo/client/core"

import { CARD_PAYLOAD } from "../fragements"

export const CARDS = gql`
    query Cards {
        cards {
            ...CardPayload
        }
    }
    ${CARD_PAYLOAD}
`
