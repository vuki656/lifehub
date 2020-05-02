import { gql } from 'apollo-server'

export const taskType = gql`
    type Task {
        id: String!,
        title: String!,
        checked: Boolean!,
        date: GraphQLDateTime!,
        taskCardId: String,
    }

    extend type Query {
        getTasksByDateAndTaskCard(taskCardId: String!, selectedDate: String!): [Task]!
    }

    extend type Mutation {
        createTask(title: String!, checked: Boolean!, date: String!, taskCardId: String!, username: String!): Task!
    }
`
