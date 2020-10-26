import { gql } from '@apollo/client/core'

import { TASK_PAYLOAD } from '../fragements'

export const TASKS = gql`
    query Tasks($args: TasksArgs!) {
        tasks(args: $args) {
            ...TaskPayload
        }
    }
    ${TASK_PAYLOAD}
`
