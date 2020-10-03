export type ReminderAddDialogProps = {
    onSubmit(): void,
}

export type ReminderDialogFormType = {
    id?: string,
    title: string,
    note?: string,
    dueDate: string,
}
