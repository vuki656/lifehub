import { TaskMetaDataType, TaskMetaDataVariables } from '../taskMetaData/taskMetaData.types'

export type TaskType = {
    id: string,
    date: string,
    isCompleted: boolean,
    taskMetaData: TaskMetaDataType,
}

// ** VARIABLES **
export type createTaskVariables = {
    input: {
        taskCardId: string,
        date: string,
        taskMetaData: {
            title: string,
        },
    },
}

export type getTasksByDateAndTaskCardVariables = {
    input: {
        selectedDate: string,
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
        date: string,
        taskCard: string,
        taskMetaData: TaskMetaDataVariables,
    },
}

export type deleteTaskVariables = {
    input: {
        taskId: string,
        taskMetaDataId: string,
    },
}

export type deleteSingleTaskInstanceVariables = {
    input: {
        taskId: string,
        taskMetaDataId: string,
        rruleStr: string,
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
        __typename: string,
    },
}

export type deleteTaskResponse = {
    deleteTask: {
        taskId: string,
        __typename: string,
    },
}

export type deleteSingleTaskInstanceResponse = {
    deleteSingleTaskInstance: {
        taskId: string,
        __typename: string,
    },
}
