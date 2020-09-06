import gql from "graphql-tag"

export const CARDS = gql`
    query cards($cardTasksArgs: CardTasksArgs!) {
        cards {
            id
            name
            tasks(args: $cardTasksArgs) {
                id
                title
                note
                date
                isCompleted
            }
        }
    }
`
