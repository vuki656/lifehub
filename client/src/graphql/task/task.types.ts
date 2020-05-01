export type TaskType = {
    id: string,
    title: string,
}

export type createTaskVariables = {
    username: string,
    title: string,
}

export type createTaskResponse = {
    createTask: TaskType,
}
