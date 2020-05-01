export type TaskCardType = {
    id: string,
    name: string,
}

// ** VARIABLES **
export type createTaskCardVariables = {
    username: string,
    name: string,
}

export type getAllTaskCardsVariables = {
    username: string,
}

// ** RESPONSES **
export type createTaskCardResponse = {
    createTaskCard: TaskCardType,
}

export type getAllTaskCardsResponse = {
    getAllTaskCards: TaskCardType[],
}
