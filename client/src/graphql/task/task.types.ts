import { TaskMetaDataType, TaskMetaDataVariables } from '../taskMetaData/taskMetaData.types'

export type TaskType = {
    id: string,
    title: string,
    note: string,
    checked: boolean,
    taskCardId: string,
    taskMetaData: TaskMetaDataType,
}

// ** VARIABLES **
export type createTaskVariables = {
    input: {
        title: string,
        taskCardId: string,
        taskMetaData: TaskMetaDataVariables,
    },
}

// ** RESPONSES **
export type createTaskResponse = {
    createTask: TaskType,
}
