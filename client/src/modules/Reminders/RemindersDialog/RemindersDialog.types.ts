import { DialogProps } from '../../../types'
import { ReminderType } from '../RemindersCard'

export type RemindersDialogProps = DialogProps & {
    reminder?: ReminderType,
}

export type ReminderDialogFormType = {
    id?: string,
    title: string,
    note?: string,
    dueDate: string,
}

