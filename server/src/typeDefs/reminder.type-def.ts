import { gql } from 'apollo-server'

export const reminderType = gql`
    type Reminder {
        title: String!,
        description: String,
        startDate: String!,
        endDate: String!,
    }

    extend type Query {
        getRemindersByDate(username: String!, selectedDate: String!): [Reminder]!
    }

    extend type Mutation {
        createReminder(title: String!, description: String, username: String!, startDate: String!, endDate: String!): Reminder!
    }
`
