export type TaskType = {
    id: string,
    title: string,
    note: string,
    checked: boolean,
    date: Date,
    taskCardId?: string,
}

export type DeleteTaskResponse = {
    id: string,
}

// ** VARIABLES **
export type createTaskVariables = {
    username: string,
    title: string,
    note: string,
    checked: boolean,
    date: Date,
    taskCardId: string,
}

export type updateTaskVariables = {
    id: string,
    title: string,
    note: string,
    date: Date,
}

export type deleteTaskVariables = {
    id: string,
}

export type toggleTaskVariables = {
    id: string,
    checked: boolean,
}

export type getTasksByDateAndTaskCardVariables = {
    taskCardId: string,
    selectedDate: Date,
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

export type toggleTaskResponse = {
    toggleTask: TaskType,
}

export type getTasksByDateAndTaskCardResponse = {
    getTasksByDateAndTaskCard: TaskType[],
}
