import React from 'react'
import { useToggle } from 'react-use'

import { TaskProps } from './Task.types'

export const Task: React.FC<TaskProps> = (props) => {
    const { task } = props

    const [isTaskChecked, toggleTaskChecked] = useToggle(false)

    return (
        <div className="task">
            <input
                type="checkbox"
                checked={isTaskChecked}
                className="task__checkbox"
                onChange={toggleTaskChecked}
            />
            <label
                htmlFor="task__checkbox"
                className={'task__title ' + (isTaskChecked ? 'task__title--disabled' : '')}
            >
                {task.title}
            </label>
        </div>
    )
}
