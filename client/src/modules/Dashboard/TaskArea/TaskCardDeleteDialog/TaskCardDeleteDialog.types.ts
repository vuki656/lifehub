import { TaskCardType } from '../TaskCard'

export type TaskCardDeleteDialogProps = {
    isDialogOpen: boolean,
    toggleDialog: () => void,
    taskCard?: TaskCardType,
}
