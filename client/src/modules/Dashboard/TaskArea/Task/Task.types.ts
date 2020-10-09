import { TaskCardType } from '../TaskCard'

export type TaskProps = {
    task: TaskType,
    taskCard?: TaskCardType,
}

export type TaskMetaDataType = {
    id: string,
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
    title: string,
    note: string,
    isCompleted: boolean,
}
