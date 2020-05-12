import { gql } from 'apollo-server'

export const repeatingTaskInstanceType = gql`
    type RepeatingTaskInstance {
        id: String!,
        date: GraphQLDateTime!,
        isChecked: Boolean!,
    }

    extend type Mutation {
        updateRepeatingTaskInstance(isChecked: Boolean!, date: String!, id: String!): RepeatingTaskInstance!
        deleteRepeatingTaskInstance(repeatingTaskInstanceId: String!, taskId: String!, rruleStrWithUpdatedExclusions: String!): RepeatingTaskInstance!,
        deleteFirstRepeatingTaskInstance(taskId: String!): RepeatingTaskInstance!
    }
`
