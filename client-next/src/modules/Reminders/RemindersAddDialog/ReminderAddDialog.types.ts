export type ReminderAddDialogProps = {
    onSubmit(): void,
}

export type ReminderAddDialogFormType = {
    title: string,
    note?: string,
    dueDate: string,
}
