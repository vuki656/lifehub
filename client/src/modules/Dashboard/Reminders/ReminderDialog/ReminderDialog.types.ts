import { ReminderType } from '../../../../graphql/reminder/reminder.types'

export type ReminderDialogProps = {
    toggleDialog: () => void,
    isDialogOpen: boolean,
    reminder?: ReminderType,
}
