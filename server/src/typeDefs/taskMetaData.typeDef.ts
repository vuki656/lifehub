import { gql } from 'apollo-server'

export const taskMetaDataType = gql`
    type TaskMetaData {
        id: ID!,
        title: String!,
        note: String,
        startDate: GraphQLDate,
        endDate: GraphQLDate,
        rrule: String,
        isRepeating: Boolean,
        isHabit: Boolean,
        nextRepeatingInstance: GraphQLDate,
        taskCard: TaskCard!,
    }

    input TaskMetaDataInput {
        id: ID,
        title: String!,
        note: String,
        startDate: GraphQLDate,
        endDate: GraphQLDate,
        rrule: String,
        isRepeating: Boolean,
        isHabit: Boolean,
        nextRepeatingInstance: GraphQLDate,
        taskCard: String!,
    }
`
