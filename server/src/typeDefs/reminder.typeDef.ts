import { gql } from 'apollo-server'

export const reminderType = gql`
    type Reminder {
        id: String!
        title: String!,
        description: String,
        startDate: GraphQLDate!,
        endDate: GraphQLDate!,
    }

    type ReminderDeleteResponse {
        id: String!,
    }

    extend type Query {
        getRemindersByDate(username: String!, selectedDate: String!): [Reminder!]!
    }

    extend type Mutation {
        createReminder(title: String!, description: String, username: String!, startDate: String!, endDate: String!): Reminder!
        updateReminder(title: String!, description: String, startDate: String!, endDate: String!, id: String!): Reminder!
        deleteReminder(id: String!): ReminderDeleteResponse!
    }
`
