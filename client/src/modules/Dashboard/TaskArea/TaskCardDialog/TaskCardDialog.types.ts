import { TaskCardType } from '../../../../graphql/taskCard/taskCard.types'

export type TaskCardDialogProps = {
    isDialogOpen: boolean,
    toggleDialog: () => void,
    taskCard?: TaskCardType,
}

export type TaskCardFormTypes = {
    name: string,
}
