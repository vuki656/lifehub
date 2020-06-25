import gql from 'graphql-tag'

export const GET_ALL_TASK_CARDS = gql`
    #    query getAllTaskCards($username: String!) {
    #        getAllTaskCards(username: $username) {
    #            id
    #            name
    #        }
    #    }
`
