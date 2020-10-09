import { ReminderType } from '../RemindersCard'

export type RemindersDialogProps = {
    toggleDialog(): void,
    isDialogOpen: boolean,
    reminder: ReminderType,
    onSubmit(): void,
}
