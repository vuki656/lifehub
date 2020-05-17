import { gql } from 'apollo-server'

export const taskMetaDataType = gql`
    type TaskMetaData {
        id: String!,
        startDate: GraphQLDateTime,
        endDate: GraphQLDateTime,
        rrule: String,
        isRepeating: Boolean,
        isHabit: Boolean,
        nextRepeatingInstance: GraphQLDateTime,
    }

    input TaskMetaDataInput {
        startDate: GraphQLDateTime,
        endDate: GraphQLDateTime,
        rrule: String,
        isRepeating: Boolean,
        isHabit: Boolean,
        nextRepeatingInstance: GraphQLDateTime,
    }
`
