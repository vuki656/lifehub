import { DialogProps } from '../../../types'

export type CardType = {
    id: string,
    name: string,
}

export type TasksCardDialogProps = DialogProps & {
    card?: CardType
}
