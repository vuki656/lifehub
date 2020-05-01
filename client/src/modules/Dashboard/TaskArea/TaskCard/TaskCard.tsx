import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import React from 'react'
import { useToggle } from 'react-use'
import { TaskCardDeleteDialog } from '../TaskCardDeleteDialog'

import { TaskCardDialog } from '../TaskCardDialog'
import { TaskCardProps } from './TaskCard.types'

export const TaskCard: React.FC<TaskCardProps> = (props) => {
    const { taskCard } = props

    const [isEditDialogOpen, toggleEditDialog] = useToggle(false)
    const [isDeleteDialogOpen, toggleDeleteDialog] = useToggle(false)

    return (
        <div className="task-card">
            <div className="task-card__header">
                <p className="task-card__name">{taskCard.name}</p>
                <div>
                    <DeleteOutlineRoundedIcon className="task-card__icon" onClick={toggleDeleteDialog} />
                    <EditRoundedIcon className="task-card__icon" onClick={toggleEditDialog} />
                </div>
            </div>
            <TaskCardDialog
                isDialogOpen={isEditDialogOpen}
                toggleDialog={toggleEditDialog}
                taskCard={taskCard}
            />
            <TaskCardDeleteDialog
                isDialogOpen={isDeleteDialogOpen}
                toggleDialog={toggleDeleteDialog}
                taskCard={taskCard}
            />
        </div>
    )
}
