import { useMutation } from '@apollo/react-hooks'
import LoopIcon from '@material-ui/icons/Loop'
import _ from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'
import { RRule, RRuleSet, rrulestr } from 'rrule'

import { ErrorMessage } from '../../../../components/ErrorMessage'
import { UPDATE_REPEATING_TASK_INSTANCE } from '../../../../graphql/repeatingTaskInstance/repeatingTaskInstance'
import {
    updateRepeatingTaskInstanceResponse,
    updateRepeatingTaskInstanceVariables,
} from '../../../../graphql/repeatingTaskInstance/repeatingTaskInstance.types'
import { UPDATE_TASK } from '../../../../graphql/task/task'
import { updateTaskResponse, updateTaskVariables } from '../../../../graphql/task/task.types'
import { TaskDialog } from '../TaskDialog'
import { TaskProps } from './Task.types'

export const Task: React.FC<TaskProps> = (props) => {
    const { task, taskCard } = props

    const { selectedDate } = useSelector((state) => state.user)
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const [isTaskChecked, toggleTaskChecked] = useToggle(_.isEmpty(task.repeatingTaskInstances) ? task.checked : task.repeatingTaskInstances[0].isChecked)
    const [isDialogOpen, toggleDialog] = useToggle(false)
    const [rruleObj, setRruleObj] = useState<RRuleSet | RRule>()

    const [updateTaskMutation] = useMutation<updateTaskResponse, updateTaskVariables>(UPDATE_TASK)
    const [updateRepeatingTaskInstanceMutation] = useMutation<updateRepeatingTaskInstanceResponse, updateRepeatingTaskInstanceVariables>(UPDATE_REPEATING_TASK_INSTANCE)

    useEffect(() => {

        if (task.rrule) {
            const rruleSetObj: RRuleSet | RRule = rrulestr(task.rrule, { forceset: true })
            setRruleObj(rruleSetObj)
        } else {
            setRruleObj(new RRule())
        }
    }, [task.rrule])

    // Disable onClick if dialog open so its not closed on click anywhere in dialog
    const handleTaskClick = useCallback(() => {
        !isDialogOpen && toggleDialog()
    }, [isDialogOpen, toggleDialog])

    // Check root task instance in database
    const updateRootTaskInstanceCheck = useCallback(() => {
        updateTaskMutation({
            variables: {
                id: task.id,
                checked: !task.checked,
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [task.checked, task.id, updateTaskMutation])

    // Update repeating task instance check status in database
    const updateRepeatingTaskInstanceCheck = useCallback(() => {
        updateRepeatingTaskInstanceMutation({
            variables: {
                id: task.repeatingTaskInstances[0].id,
                date: task.repeatingTaskInstances[0].date,
                isChecked: !task.repeatingTaskInstances[0].isChecked,
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [task.repeatingTaskInstances, updateRepeatingTaskInstanceMutation])

    // Update repeating task instance if selected day date isn't root task date => not root task
    const handleTaskCheck = useCallback(() => {
        if (!moment(selectedDate).isSame(task.date)) {
            updateRepeatingTaskInstanceCheck()
        } else {
            updateRootTaskInstanceCheck()
        }

        toggleTaskChecked()
    }, [toggleTaskChecked, updateRootTaskInstanceCheck, selectedDate, task.date, updateRepeatingTaskInstanceCheck])

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
            {errors.error && (
                <div className="task__error">
                    <ErrorMessage error={errors.error} />
                </div>
            )}
            {task.isRepeating && (
                <LoopIcon className="task__icon" />
            )}
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
