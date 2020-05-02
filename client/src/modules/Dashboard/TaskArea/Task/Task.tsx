import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { useToggle } from 'react-use'
import { TOGGLE_TASK } from '../../../../graphql/task/task'
import { toggleTaskResponse, toggleTaskVariables } from '../../../../graphql/task/task.types'
import { TaskDialog } from '../TaskDialog'

import { TaskProps } from './Task.types'

export const Task: React.FC<TaskProps> = (props) => {
    const { task, taskCard } = props

    const [isTaskChecked, toggleTaskChecked] = useToggle(task.checked)
    const [isDialogOpen, toggleDialog] = useToggle(false)

    const [toggleTaskMutation] = useMutation<toggleTaskResponse, toggleTaskVariables>(TOGGLE_TASK)

    // Disable onClick if dialog open so its not closed on click anywhere in dialog
    const handleTaskClick = useCallback(() => {
        !isDialogOpen && toggleDialog()
    }, [isDialogOpen, toggleDialog])

    // Check task in database
    const updateTaskCheck = useCallback(() => {
        toggleTaskMutation({
            variables: {
                id: task.id,
                checked: !task.checked,
            },
        })
        .catch((error) => {
            console.log(error)
        })
    }, [task.checked, task.id, toggleTaskMutation])

    const handleTaskCheck = useCallback(() => {
        updateTaskCheck()
        toggleTaskChecked()
    }, [toggleTaskChecked, updateTaskCheck])

    return (
        <div className="task" onClick={handleTaskClick}>
            <input
                type="checkbox"
                checked={isTaskChecked}
                className="task__checkbox"
                onChange={handleTaskCheck}
                onClick={(event) => event.stopPropagation()}
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
