import { TaskMetaDataType, TaskMetaDataVariables } from '../taskMetaData/taskMetaData.types'

export type TaskType = {
    id: string,
    date: Date,
    isCompleted: boolean,
    taskCardId: string,
    taskMetaData: TaskMetaDataType,
}

// ** VARIABLES **
export type createTaskVariables = {
    input: {
        taskCardId: string,
        date: Date,
        taskMetaData: {
            title: string,
        },
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

export type updateTaskVariables = {
    input: {
        id: string,
        date: Date,
        taskMetaData: TaskMetaDataVariables,
    },
}

// ** RESPONSES **
export type createTaskResponse = {
    createTask: {
        task: TaskType,
        __typename: string,
    },
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

export type updateTaskResponse = {
    updateTask: {
        task: TaskType,
    },
}
