// ** VARIABLES **
export type createReminderVariables = {
    username: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

// ** RESPONSES **
export type createReminderResponse = {
    username: string,
    title: string,
    description: string,
    startDate: Date,
    Date: Date,
}
