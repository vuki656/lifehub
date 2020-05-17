import { useMutation } from '@apollo/react-hooks'
import LoopIcon from '@material-ui/icons/Loop'
import React, { useCallback } from 'react'
import { useToggle } from 'react-use'

import { ErrorMessage } from '../../../../components/ErrorMessage'
import { TOGGLE_TASK_COMPLETED } from '../../../../graphql/task/task'
import { toggleTaskCompletedResponse, toggleTaskCompletedVariables } from '../../../../graphql/task/task.types'
import { TaskDialog } from '../TaskDialog'
import { TaskProps } from './Task.types'

export const Task: React.FC<TaskProps> = (props) => {
    const { task, taskCard } = props

    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const [isTaskCompleted, toggleTaskCompletedCheckbox] = useToggle(task.isCompleted)
    const [isDialogOpen, toggleDialog] = useToggle(false)

    const [toggleTaskCompletedMutation] = useMutation<toggleTaskCompletedResponse, toggleTaskCompletedVariables>(TOGGLE_TASK_COMPLETED)

    // Disable onClick if dialog open so its not closed on click anywhere in dialog
    const handleTaskClick = useCallback(() => {
        !isDialogOpen && toggleDialog()
    }, [isDialogOpen, toggleDialog])

    // Toggle task isCompleted status in database
    const toggleTaskCompleted = useCallback(() => {
        toggleTaskCompletedMutation({
            variables: {
                input: {
                    id: task.id,
                },
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [toggleTaskCompletedMutation, task.id])

    // Toggle tasks isChecked status and toggle checkbox
    const handleTaskCompletedToggle = useCallback(() => {
        toggleTaskCompleted()
        toggleTaskCompletedCheckbox()
    }, [toggleTaskCompleted, toggleTaskCompletedCheckbox])

    return (
        <div className="task" onClick={handleTaskClick}>
            <input
                type="checkbox"
                checked={isTaskCompleted}
                className="task__checkbox"
                onChange={handleTaskCompletedToggle}
                onClick={(event) => event.stopPropagation()}
            />
            <label
                htmlFor="task__checkbox"
                className={'task__title ' + (isTaskCompleted ? 'task__title--disabled' : '')}
            >
                {task.title}
            </label>
            {errors.error && (
                <div className="task__error">
                    <ErrorMessage error={errors.error} />
                </div>
            )}
            {task.taskMetaData.isRepeating && (
                <LoopIcon className="task__icon" />
            )}
            <TaskDialog
                isDialogOpen={isDialogOpen}
                toggleDialog={toggleDialog}
                task={task}
                taskCardId={taskCard.id}
            />
        </div>
    )
}
