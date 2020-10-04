import { TaskType } from '../Task'

export type TaskCardProps = {
    taskCard: TaskCardType,
}

export type CreateTaskFormTypes = {
    title: string,
}

export type TaskCardType = {
    id: string,
    name: string,
    tasks?: TaskType[],
}
