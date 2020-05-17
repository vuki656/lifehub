import { TaskMetaDataType } from '../taskMetaData/taskMetaData.types'

export type TaskType = {
    id: string,
    title: string,
    note: string,
    date: Date,
    isCompleted: boolean,
    taskCardId: string,
    taskMetaData: TaskMetaDataType,
}

// ** VARIABLES **
export type createTaskVariables = {
    input: {
        title: string,
        taskCardId: string,
        date: Date,
    },
}

export type getTasksByDateAndTaskCardVariables = {
    input: {
        selectedDate: Date,
        taskCardId: string,
    },
}

export type toggleTaskCompletedVariables = {
    input: {
        id: string,
    },
}

// ** RESPONSES **
export type createTaskResponse = {
    createTask: TaskType,
}

export type getTasksByDateAndTaskCardResponse = {
    getTasksByDateAndTaskCard: {
        tasks: [TaskType],
    },
}

export type toggleTaskCompletedResponse = {
    toggleTaskCompleted: {
        task: TaskType,
    },
}
