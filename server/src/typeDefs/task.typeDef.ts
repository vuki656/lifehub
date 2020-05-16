import { gql } from 'apollo-server'

export const taskType = gql`
    type Task {
        id: String!,
        title: String!,
        note: String,
        checked: Boolean,
        taskCardId: String,
        taskMetaData: TaskMetaData!
    }

    input TaskInput {
        title: String!,
        note: String,
        checked: Boolean,
        taskCardId: String,
        taskMetaData: TaskMetaDataInput!
    }

    type CreateTaskPayload {
        task: Task!
    }

    extend type Mutation {
        createTask(input: TaskInput): CreateTaskPayload!
    }
`
