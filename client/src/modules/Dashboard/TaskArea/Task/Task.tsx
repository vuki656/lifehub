import React from 'react'

import { TaskProps } from './Task.types'

export const Task: React.FC<TaskProps> = (props) => {
    const { task } = props

    return (
        <div className="task">
            <p>{task.title}</p>
        </div>
    )
}
