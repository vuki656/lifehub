import { useMutation } from '@apollo/react-hooks'
import LoopIcon from '@material-ui/icons/Loop'
import React, { useCallback, useEffect, useState } from 'react'
import { useToggle } from 'react-use'
import RRule, { RRuleSet, rrulestr } from 'rrule'

import { Message } from '../../../../components/Message'
import { TOGGLE_TASK_COMPLETED } from '../../../../graphql/task/task'
import { toggleTaskCompletedResponse, toggleTaskCompletedVariables } from '../../../../graphql/task/task.types'
import { TaskDialog } from '../TaskDialog'
import { TaskProps } from './Task.types'

export const Task: React.FC<TaskProps> = (props) => {
    const { task, taskCard } = props

    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const [isTaskCompleted, toggleTaskCompletedCheckbox] = useToggle(task.isCompleted)
    const [isDialogOpen, toggleDialog] = useToggle(false)
    const [taskRRuleObj, setTaskRRuleObj] = useState<RRule | RRuleSet>()

    const [toggleTaskCompletedMutation] = useMutation<toggleTaskCompletedResponse, toggleTaskCompletedVariables>(TOGGLE_TASK_COMPLETED)

    // Set task rrule to empty obj if it has no rrule
    const setRruleObj = useCallback(() => {
        if (task.taskMetaData.rrule) {
            const rruleObj = rrulestr(task.taskMetaData.rrule)
            setTaskRRuleObj(rruleObj)
        } else {
            setTaskRRuleObj(new RRule())
        }
    }, [task.taskMetaData.rrule])

    useEffect(() => {
        setRruleObj()
    }, [setRruleObj])

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
                {task.taskMetaData.title}
            </label>
            {errors.error && (
                <div className="task__error">
                    <Message message={errors.error} type="error" />
                </div>
            )}
            {task.taskMetaData.isRepeating && (
                <LoopIcon className="task__icon" />
            )}
            {taskRRuleObj && (
                <TaskDialog
                    isDialogOpen={isDialogOpen}
                    toggleDialog={toggleDialog}
                    task={task}
                    taskRRuleObj={taskRRuleObj}
                    taskCardId={taskCard.id}
                />
            )}
        </div>
    )
}
