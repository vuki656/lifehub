import { TaskCardType } from '../TaskCard'

export type TaskCardDialogProps = {
    isDialogOpen: boolean,
    toggleDialog: () => void,
    taskCard?: TaskCardType,
}

export type TaskCardFormTypes = {
    name: string,
}
