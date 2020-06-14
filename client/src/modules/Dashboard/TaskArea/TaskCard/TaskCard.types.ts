import { TaskCardType } from '../../../../graphql/taskCard/taskCard.types'

export type TaskCardProps = {
    taskCard: TaskCardType,
}

export type CreateTaskFormTypes = {
    title: string,
}
