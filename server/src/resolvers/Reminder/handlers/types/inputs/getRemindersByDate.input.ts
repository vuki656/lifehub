export type GetRemindersByDateInput = {
    username: string,
    date: Date | 'overdue' | 'upcoming',
}
