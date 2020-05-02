import { TaskType } from '../../../../graphql/task/task.types'
import { TaskCardType } from '../../../../graphql/taskCard/taskCard.types'

export type TaskProps = {
    task: TaskType,
    taskCard: TaskCardType,
}
