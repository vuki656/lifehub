import { TaskType } from '../../../../graphql/task/task.types'
import { TaskCardType } from '../../../../graphql/taskCard/taskCard.types'

export type TaskProps = {
    task: TaskType,
    taskCard: TaskCardType,
}

export type TaskMetaDataType = {
    id: string,
    title: string,
    note: string,
    startDate: string,
    endDate: string,
    rrule: string,
    isRepeating: boolean,
    isHabit: boolean,
    nextRepeatingInstance: string,
    taskCard: string,
}

export type TaskType = {
    id: string,
    date: string,
    isCompleted: boolean,
    taskMetaData: TaskMetaDataType,
}
