import { gql } from 'apollo-boost'

export const UPDATE_REPEATING_TASK_INSTANCE = gql`
    mutation updateRepeatingTaskInstance($isChecked: Boolean!, $date: String!, $id: String!) {
        updateRepeatingTaskInstance(isChecked: $isChecked, date: $date, id: $id) {
            id
            isChecked
            date
        }
    }
`

export const DELETE_REPEATING_TASK_INSTANCE = gql`
    mutation deleteRepeatingTaskInstance($repeatingTaskInstanceId: String!, $taskId: String!, $rruleStrWithUpdatedExclusions: String!) {
        deleteRepeatingTaskInstance(repeatingTaskInstanceId: $repeatingTaskInstanceId, taskId: $taskId, rruleStrWithUpdatedExclusions: $rruleStrWithUpdatedExclusions) {
            id
            isChecked
            date
        }
    }
`
