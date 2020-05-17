import { gql } from 'apollo-server'

export const taskType = gql`
    type Task {
        id: ID!,
        title: String!,
        note: String,
        date: GraphQLDateTime!,
        isCompleted: Boolean,
        taskCardId: String,
        taskMetaData: TaskMetaData!
    }

    input TaskInput {
        title: String!,
        date: GraphQLDateTime!,
        note: String,
        isCompleted: Boolean,
        taskCardId: String,
        taskMetaData: TaskMetaDataInput
    }

    input GetTasksByDateAndTaskCardInput {
        selectedDate: GraphQLDateTime!,
        taskCardId: String!,
    }

    input ToggleTaskCompletedInput {
        id: ID!
    }

    type CreateTaskPayload {
        task: Task!
    }

    type GetTasksByDateAndTaskCardPayload {
        tasks: [Task]!
    }

    type ToggleTaskCompletedPayload {
        task: Task!
    }

    extend type Query {
        getTasksByDateAndTaskCard(input: GetTasksByDateAndTaskCardInput!): GetTasksByDateAndTaskCardPayload!
    }

    extend type Mutation {
        createTask(input: TaskInput!): CreateTaskPayload!
        toggleTaskCompleted(input: ToggleTaskCompletedInput!): ToggleTaskCompletedPayload!
    }
`
