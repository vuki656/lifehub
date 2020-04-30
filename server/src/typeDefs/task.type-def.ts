import { gql } from 'apollo-server'

export const taskType = gql`
    type Task {
        id: String,
        title: String,
    }

    extend type Mutation {
        createTask(title: String!,username: String!): Task!
    }
`
