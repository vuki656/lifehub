export type ReminderType = {
    id?: string,
    title: string,
    description?: string,
    startDate: number,
    endDate: number,
}

export type ReminderErrors = {
    error?: string,
}
