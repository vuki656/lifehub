import { ReminderType } from '../../../../graphql/reminder/reminder.types'

export type ReminderDialogProps = {
    toggleDialog: () => void,
    isDialogOpen: boolean,
    reminder?: ReminderType,
}

export type ReminderFormTypes = {
    title: string,
    description: string,
    startDate: Date,
    endDate: Date | undefined,
}
