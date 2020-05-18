import { gql } from 'apollo-server'

export const taskMetaDataType = gql`
    type TaskMetaData {
        id: ID!,
        title: String!,
        note: String,
        startDate: GraphQLDateTime,
        endDate: GraphQLDateTime,
        rrule: String,
        isRepeating: Boolean,
        isHabit: Boolean,
        nextRepeatingInstance: GraphQLDateTime,
    }

    input TaskMetaDataInput {
        id: ID,
        title: String!,
        note: String,
        startDate: GraphQLDateTime,
        endDate: GraphQLDateTime,
        rrule: String,
        isRepeating: Boolean,
        isHabit: Boolean,
        nextRepeatingInstance: GraphQLDateTime,
    }
`
