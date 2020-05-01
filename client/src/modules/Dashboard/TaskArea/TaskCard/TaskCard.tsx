import EditRoundedIcon from '@material-ui/icons/EditRounded'
import React from 'react'
import { useToggle } from 'react-use'

import { TaskCardDialog } from '../TaskCardDialog'
import { TaskCardProps } from './TaskCard.types'

export const TaskCard: React.FC<TaskCardProps> = (props) => {
    const { taskCard } = props

    const [isDialogOpen, toggleDialog] = useToggle(false)

    return (
        <div className="task-card">
            <div className="task-card__header">
                <p className="task-card__name">{taskCard.name}</p>
                <EditRoundedIcon className="task-card__icon" onClick={toggleDialog} />
            </div>
            <TaskCardDialog
                isDialogOpen={isDialogOpen}
                toggleDialog={toggleDialog}
                taskCard={taskCard}
            />
        </div>
    )
}
