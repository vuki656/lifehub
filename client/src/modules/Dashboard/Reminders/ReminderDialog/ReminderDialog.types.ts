import { ReminderType } from '../Reminder.types'

export type ReminderDialogProps = {
    toggleDialog: () => void,
    isDialogOpen: boolean,
    reminder?: ReminderType,
}
