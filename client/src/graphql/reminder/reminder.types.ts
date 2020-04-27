// ** VARIABLES **
export type createReminderVariables = {
    username: string,
    title: string,
    description: string,
    start: string,
    end: string,
}

// ** RESPONSES **
export type createReminderResponse = {
    username: string,
    title: string,
    description: string,
    start: Date,
    end: Date,
}
