import { DialogProps } from "../../../types"
import { ReminderType } from "../RemindersCard"

export type RemindersDialogProps = DialogProps & {
    reminder?: ReminderType,
}
