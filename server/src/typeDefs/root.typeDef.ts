import { gql } from 'apollo-server'

// Defines empty Query and Mutation so others can extend onto it
// Solves: Not knowing where the root Query and Mutation were defined
// _empty: String is needed because types can't be empty
// Also holds custom scalars
export const rootType = gql`
    scalar GraphQLDate
    scalar Void

    type Query { _empty: String }
    type Mutation { _empty: String }
`
