import gql from 'graphql-tag'

export const GET_TASKS_BY_DATE_AND_TASK_CARD = gql`
    #    query getTasksByDateAndTaskCard($input: GetTasksByDateAndTaskCardInput!) {
    #        getTasksByDateAndTaskCard(input: $input) {
    #            tasks {
    #                id
    #                date
    #                isCompleted
    #                taskMetaData {
    #                    id
    #                    title
    #                    note
    #                    startDate
    #                    endDate
    #                    rrule
    #                    isRepeating
    #                    isHabit
    #                    nextRepeatingInstance
    #                    taskCard {
    #                        id
    #                    }
    #                }
    #            }
    #        }
    #    }
`
