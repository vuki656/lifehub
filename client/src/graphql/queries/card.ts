import gql from "graphql-tag"

export const CARDS = gql`
    query cards {
        cards {
            id
            name
        }
    }
`
