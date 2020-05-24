export type TaskCardType = {
    id: string,
    name: string,
}

export type DeleteTaskCardResponse = {
    id: string,
}

// ** VARIABLES **
export type createTaskCardVariables = {
    username: string,
    name: string,
}

export type getAllTaskCardsVariables = {
    username: string,
}

export type updateTaskCardVariables = {
    id: string,
    name: string,
}

export type deleteTaskCardVariables = {
    id: string,
}

// ** RESPONSES **
export type createTaskCardResponse = {
    createTaskCard: TaskCardType,
}

export type getAllTaskCardsResponse = {
    getAllTaskCards: TaskCardType[],
}

export type updateTaskCardResponse = {
    updateTaskCard: TaskCardType,
}

export type deleteTaskCardResponse = {
    deleteTaskCard: DeleteTaskCardResponse,
}
