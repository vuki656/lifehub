import { gql } from 'apollo-boost'

export const CREATE_TASK = gql`
    mutation createTask($input: TaskInput) {
        createTask(input: $input) {
           task {
               id
               title
               note
               checked
               taskCardId
               taskMetaData {
                   id
                   date
                   endDate
                   rrule
                   isRepeating
                   isHabbit
                   nextRepeatingInstance
               }
           }
        }
    }
`
