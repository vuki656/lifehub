import { gql } from 'apollo-server'

export const taskType = gql`
    type Task {
        id: String!,
        title: String!,
        note: String,
        checked: Boolean!,
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
        createTask(title: String!, note: String, checked: Boolean!, date: String!, taskCardId: String!, username: String!): Task!
        updateTask(title: String, note: String, date: String, id: String!): Task!
        deleteTask(id: String!): DeleteTaskResponse!
        toggleTask(id: String!, checked: Boolean!): Task!
    }
`
