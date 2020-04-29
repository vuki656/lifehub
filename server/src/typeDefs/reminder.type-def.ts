import { gql } from 'apollo-server'

export const reminderType = gql`
    scalar GraphQLDateTime

    type Reminder {
        id: String!
        title: String!,
        description: String,
        startDate: GraphQLDateTime!,
        endDate: GraphQLDateTime!,
    }

    type ReminderDeleteResponse {
        id: String!,
    }

    extend type Query {
        getRemindersByDate(username: String!, selectedDate: String!): [Reminder]!
    }

    extend type Mutation {
        createReminder(title: String!, description: String, username: String!, startDate: String!, endDate: String!): Reminder!
        updateReminder(title: String!, description: String, startDate: Float!, endDate: Float!, id: String!): Reminder!
        deleteReminder(id: String!): ReminderDeleteResponse!
    }
`
