export type RemindersCardProps = {
    reminder: ReminderType
}

export type ReminderType = {
    id: string,
    title: string,
    note?: string,
    dueDate: string,
}
