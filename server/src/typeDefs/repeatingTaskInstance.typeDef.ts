import { gql } from 'apollo-server'

export const repeatingTaskInstanceType = gql`
    extend type Mutation {
        updateRepeatingTaskInstance(isChecked: Boolean!, date: String!, id: String!): RepeatingTaskInstance!
    }
`
