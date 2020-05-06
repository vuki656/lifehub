import { useMutation } from '@apollo/react-hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { useToggle } from 'react-use'
import { RRule, rrulestr } from 'rrule'

import { UPDATE_TASK } from '../../../../graphql/task/task'
import { updateTaskResponse, updateTaskVariables } from '../../../../graphql/task/task.types'
import { TaskDialog } from '../TaskDialog'
import { TaskProps } from './Task.types'

export const Task: React.FC<TaskProps> = (props) => {
    const { task, taskCard } = props

    const [isTaskChecked, toggleTaskChecked] = useToggle(task.checked)
    const [isDialogOpen, toggleDialog] = useToggle(false)
    const [rruleObj, setRruleObj] = useState<RRule>()

    const [updateTaskMutation] = useMutation<updateTaskResponse, updateTaskVariables>(UPDATE_TASK)

    useEffect(() => {
        task.rrule ? setRruleObj(rrulestr(task.rrule)) : setRruleObj({})
    }, [task.rrule])

    // Disable onClick if dialog open so its not closed on click anywhere in dialog
    const handleTaskClick = useCallback(() => {
        !isDialogOpen && toggleDialog()
    }, [isDialogOpen, toggleDialog])

    // Check task in database
    const updateTaskCheck = useCallback(() => {
        updateTaskMutation({
            variables: {
                id: task.id,
                checked: !task.checked,
            },
        })
    }, [task.checked, task.id, updateTaskMutation])

    // Update db value and toggle checkbox
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
            {rruleObj && (
                <TaskDialog
                    isDialogOpen={isDialogOpen}
                    toggleDialog={toggleDialog}
                    task={task}
                    taskCardId={taskCard.id}
                    taskRrule={rruleObj}
                />
            )}
        </div>
    )
}
