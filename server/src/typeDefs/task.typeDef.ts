import { gql } from 'apollo-server'

export const taskType = gql`
    type Task {
        id: ID!,
        date: GraphQLDate!,
        isCompleted: Boolean,
        taskCardId: String,
        taskMetaData: TaskMetaData!
    }

    input CreateTaskInput {
        date: GraphQLDate!,
        taskCardId: String,
        taskMetaData: TaskMetaDataInput
    }

    input GetTasksByDateAndTaskCardInput {
        selectedDate: GraphQLDate!,
        taskCardId: String!,
    }

    input ToggleTaskCompletedInput {
        id: ID!
    }

    input UpdateTaskInput {
        id: ID!,
        date: GraphQLDate!,
        isCompleted: Boolean,
        taskCard: String,
        taskMetaData: TaskMetaDataInput!,
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

    type UpdateTaskPayload {
        task: Task!
    }

    extend type Query {
        getTasksByDateAndTaskCard(input: GetTasksByDateAndTaskCardInput!): GetTasksByDateAndTaskCardPayload!
    }

    extend type Mutation {
        createTask(input: CreateTaskInput!): CreateTaskPayload!
        updateTask(input: UpdateTaskInput!): UpdateTaskPayload!
        toggleTaskCompleted(input: ToggleTaskCompletedInput!): ToggleTaskCompletedPayload!
    }
`
