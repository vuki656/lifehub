import React from 'react'

import { TaskCardProps } from './TaskCard.types'

export const TaskCard: React.FC<TaskCardProps> = (props) => {
    const { taskCard } = props

    return (
        <div className="task-card">
            <p className="task-card__name">{taskCard.name}</p>
            <p>hi from task card</p>
        </div>
    )
}
