export type ReminderType = {
    title: string,
    description?: string,
    startDate: number,
    endDate: number,
}

// ** VARIABLES **
export type createReminderVariables = {
    username: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export type getRemindersByDateVariables = {
    username: string,
    selectedDate: string,
}

// ** RESPONSES **
export type createReminderResponse = {
    username: string,
    title: string,
    description: string,
    startDate: Date,
    Date: Date,
}

export type getRemindersByDateResponse = {
    getRemindersByDate: ReminderType[],
}
