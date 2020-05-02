export type TaskType = {
    id: string,
    title: string,
    checked: boolean,
    date: Date,
    taskCardId?: string,
}

// ** VARIABLES **
export type createTaskVariables = {
    username: string,
    title: string,
    checked: boolean,
    date: Date,
    taskCardId: string,
}

export type getTasksByDateAndTaskCardVariables = {
    taskCardId: string,
    selectedDate: Date,
}

// ** RESPONSES **
export type createTaskResponse = {
    createTask: TaskType,
}

export type getTasksByDateAndTaskCardResponse = {
    getTasksByDateAndTaskCard: TaskType[],
}
