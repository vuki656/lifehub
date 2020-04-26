import { gql } from 'apollo-server'

// Defines empty Query and Mutation so others can extend onto it
// Solves: Not knowing where the root Query and Mutation were defined
// _empty: String is needed because types can't be empty
export const rootType = gql`
    type Query { _empty: String }
    type Mutation { _empty: String }
`