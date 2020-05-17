import { gql } from 'apollo-server'

export const taskMetaDataType = gql`
    type TaskMetaData {
        id: String!,
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
