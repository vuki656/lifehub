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
    
    type ReminderPayload {
        id: ID!
        title: String!,
        description: String,
        startDate: GraphQLDate!
        endDate: GraphQLDate!
        user: UserPayload!
    }
    
    type CreateReminderPayload {
        reminder: ReminderPayload
    }
    
    input CreateReminderInput {
        title: String!,
        description: String,
        startDate: GraphQLDate!
        endDate: GraphQLDate!
        username: String!
    }

    extend type Query {
        getRemindersByDate(username: String!, selectedDate: String!): [Reminder!]!
    }

    extend type Mutation {
        createReminder(input: CreateReminderInput): CreateReminderPayload!
        updateReminder(title: String!, description: String, startDate: String!, endDate: String!, id: String!): Reminder!
        deleteReminder(id: String!): ReminderDeleteResponse!
    }
`
