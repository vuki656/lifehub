import gql from 'graphql-tag'

export const CREATE_REMINDER = gql`
    mutation createReminder($input: CreateReminderInput!) {
        createReminder(input: $input) {
          reminder {
              id
              title
              note
              startDate
              endDate
          }
        }
    }
`

export const EDIT_REMINDER = gql`
    mutation editReminder($input: EditReminderInput!) {
        editReminder(input: $input) {
            reminder {
                id
                title
                note
                startDate
                endDate
            }
        }
    }
`

export const DELETE_REMINDER = gql`
    mutation deleteReminder($id: String!) {
        deleteReminder(id: $id) {
            id
        }
    } 
`

