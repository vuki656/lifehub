import { gql } from 'apollo-server'

export const taskMetaDataType = gql`
    type TaskMetaData {
        id: String!,
        date: GraphQLDateTime!,
        endDate: GraphQLDateTime,
        rrule: String,
        isRepeating: Boolean,
        isHabbit: Boolean,
        nextRepeatingInstance: GraphQLDateTime,
    }

    input TaskMetaDataInput {
        date: GraphQLDateTime!,
        endDate: GraphQLDateTime,
        rrule: String,
        isRepeating: Boolean,
        isHabbit: Boolean,
        nextRepeatingInstance: GraphQLDateTime,
    }
`
