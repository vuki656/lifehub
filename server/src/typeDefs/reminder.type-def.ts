import { gql } from 'apollo-server'

export const reminderType = gql`
    type Reminder {
        username: String!,
        title: String!
        description: String
        start: String!
        end: String!
    }

    extend type Query {
        getAllReminders: [Reminder]!
    }

    extend type Mutation {
        createReminder( title: String!, description: String, username: String!, start: String!, end: String!): Reminder!
    }
`
