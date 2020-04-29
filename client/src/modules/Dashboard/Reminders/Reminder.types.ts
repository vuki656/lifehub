export type ReminderType = {
    id?: string,
    title: string,
    description?: string,
    startDate: Date,
    endDate: Date,
}

export type ReminderErrors = {
    error?: string,
}
