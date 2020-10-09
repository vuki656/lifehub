import { DialogProps } from '../../../types'
import { TaskType } from '../Task'

export type TaskDialogProps = DialogProps & {
    task: TaskType
}

export type TaskDialogFormType = {
    id?: string,
    title: string,
    note?: string,
    date: string,
    isCompleted: boolean,
}

