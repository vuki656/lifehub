import { RepeatingTaskInstanceType } from '../repeatingTaskInstance/repeatingTaskInstance.types'

export type TaskType = {
    id: string,
    title: string,
    note: string,
    checked: boolean,
    date: Date,
    endDate?: Date,
    rrule?: string,
    isRepeating: boolean,
    taskCardId?: string,
    repeatingTaskInstances: [RepeatingTaskInstanceType],
}

export type DeleteTaskResponse = {
    id: string,
}

// ** VARIABLES **
export type createTaskVariables = {
    username: string,
    title: string,
    date: Date,
    taskCardId: string,
}

export type updateTaskVariables = {
    id: string,
    title?: string,
    note?: string,
    date?: Date,
    endDate?: Date,
    checked?: boolean,
    rrule?: string,
    isRepeating?: boolean,
}

export type deleteTaskVariables = {
    id: string,
}

export type getTasksByDateAndTaskCardVariables = {
    taskCardId: string,
    selectedDate: string | Date,
}

// ** RESPONSES **
export type createTaskResponse = {
    createTask: TaskType,
}

export type updateTaskResponse = {
    updateTask: TaskType,
}

export type deleteTaskResponse = {
    deleteTask: DeleteTaskResponse,
}

export type getTasksByDateAndTaskCardResponse = {
    getTasksByDateAndTaskCard: TaskType[],
}
