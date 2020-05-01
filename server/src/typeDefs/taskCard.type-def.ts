import { gql } from 'apollo-server'

export const taskCardType = gql`
    type TaskCard {
        id: String,
        name: String,
    }

    extend type Query {
        getAllTaskCards(username: String!): [TaskCard]!
    }

    extend type Mutation {
        createTaskCard(username: String!, name: String!): TaskCard!
    }
`
