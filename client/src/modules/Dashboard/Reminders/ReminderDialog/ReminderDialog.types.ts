import { ReminderType } from '../Reminder.types'

export type ReminderDialogProps = {
    toggleDialog: () => void,
    isDialogOpen: boolean,
    reminder?: ReminderType,
}

export type ReminderFormTypes = {
    title: string,
    note: string,
    startDate: Date,
    endDate: Date | undefined,
}
