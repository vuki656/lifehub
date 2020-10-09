import { gql } from '@apollo/client/core'

export const CARD_PAYLOAD = gql`
    fragment CardPayload on CardType {
        id
        name
    }
`
