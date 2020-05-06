import { gql } from 'apollo-server'

export const taskType = gql`
    type Task {
        id: String!,
        title: String!,
        note: String,
        checked: Boolean!,
        rrule: String,
        isRepeating: Boolean!
        endDate: GraphQLDateTime,
        date: GraphQLDateTime!,
        taskCardId: String,
    }

    type DeleteTaskResponse {
        id: String!
    }

    extend type Query {
        getTasksByDateAndTaskCard(taskCardId: String!, selectedDate: String!): [Task]!
    }

    extend type Mutation {
        createTask(title: String!, note: String, checked: Boolean!, date: String!, rrule: String, isRepeating: Boolean!, taskCardId: String!, username: String!): Task!
        updateTask(title: String, note: String, checked: Boolean, date: String, rrule: String, isRepeating: Boolean id: String!): Task!
        deleteTask(id: String!): DeleteTaskResponse!
    }
`
