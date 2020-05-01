import { TaskType } from '../TaskArea.types'

export type TaskDialogProps = {
    isDialogOpen: boolean,
    toggleDialog: () => void,
    task?: TaskType,
}
