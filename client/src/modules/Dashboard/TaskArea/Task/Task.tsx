import React, { useCallback } from 'react'
import { useToggle } from 'react-use'
import { TaskDialog } from '../TaskDialog'

import { TaskProps } from './Task.types'

export const Task: React.FC<TaskProps> = (props) => {
    const { task, taskCard } = props

    const [isTaskChecked, toggleTaskChecked] = useToggle(false)
    const [isDialogOpen, toggleDialog] = useToggle(false)

    // Disable onClick if dialog open so its not closed on click anywhere in dialog
    const handleTaskClick = useCallback(() => {
        !isDialogOpen && toggleDialog()
    }, [isDialogOpen, toggleDialog])

    return (
        <div className="task" onClick={handleTaskClick}>
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
            <TaskDialog
                isDialogOpen={isDialogOpen}
                toggleDialog={toggleDialog}
                task={task}
                taskCardId={taskCard.id}
            />
        </div>
    )
}
