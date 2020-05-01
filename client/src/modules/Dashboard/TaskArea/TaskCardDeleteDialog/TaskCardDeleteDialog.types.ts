import { TaskCardType } from '../../../../graphql/taskCard/taskCard.types'

export type TaskCardDeleteDialogProps = {
    isDialogOpen: boolean,
    toggleDialog: () => void,
    taskCard?: TaskCardType,

}
