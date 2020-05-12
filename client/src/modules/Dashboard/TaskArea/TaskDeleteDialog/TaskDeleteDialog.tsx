import { useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { RRule, RRuleSet } from 'rrule'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { DELETE_FIRST_REPEATING_INSTANCE, DELETE_REPEATING_TASK_INSTANCE } from '../../../../graphql/repeatingTaskInstance/repeatingTaskInstance'
import {
    deleteFirstRepeatingInstanceResponse,
    deleteFirstRepeatingInstanceVariables,
    deleteRepeatingTaskInstanceResponse,
    deleteRepeatingTaskInstanceVariables,
} from '../../../../graphql/repeatingTaskInstance/repeatingTaskInstance.types'
import { UPDATE_TASK } from '../../../../graphql/task/task'
import { updateTaskResponse, updateTaskVariables } from '../../../../graphql/task/task.types'
import { TaskDeleteDialogProps } from './TaskDeleteDialog.types'

export const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = (props) => {
    const { isDeleteDialogOpen, toggleDeleteDialog, deleteTaskAndAllInstances, task, getRrule } = props

    const [selectedOption, setSelectedOption] = useState('this')
    const [errors, setErrors] = React.useState<{ error?: string }>({})

    // TODO: rename loading var
    const [updateTaskMutation, { loading: updateLoading }] = useMutation<updateTaskResponse, updateTaskVariables>(UPDATE_TASK)
    const [deleteFirstRepeatingInstanceMutation, { loading: deleteLoading2 }]
        = useMutation<deleteFirstRepeatingInstanceResponse, deleteFirstRepeatingInstanceVariables>(DELETE_FIRST_REPEATING_INSTANCE)
    const [deleteRepeatingTaskInstanceMutation, { loading: deleteLoading }]
        = useMutation<deleteRepeatingTaskInstanceResponse, deleteRepeatingTaskInstanceVariables>(DELETE_REPEATING_TASK_INSTANCE)

    const handleSingleRepeatingInstanceDelete = useCallback(() => {
        const localTaskRrule = getRrule()

        // Set deleted task date as excluded to rrule so its not created anymore, check mandatory bcz typescript
        if (localTaskRrule instanceof RRuleSet) localTaskRrule.exdate(moment(task.repeatingTaskInstances[0].date).toDate())

        deleteRepeatingTaskInstanceMutation({
            variables: {
                repeatingTaskInstanceId: task.repeatingTaskInstances[0].id,
                taskId: task.id,
                rruleStrWithUpdatedExclusions: localTaskRrule.toString(),
            },
        }) // TODO: update cache
        .then(() => {
            toggleDeleteDialog()
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [task.repeatingTaskInstances, task.id, getRrule, deleteRepeatingTaskInstanceMutation, toggleDeleteDialog])

    // Change root task date to date of next repeating instance, delete that instance
    const handleRootTaskDelete = useCallback(async () => {
        const localTaskRrule = getRrule()
        console.log(localTaskRrule)

        const nextRepeatingInstance = localTaskRrule.after(moment(task.date).toDate())

        // Clone the old rrule and add new start date to it
        const updatedRruleSet = new RRuleSet()
        updatedRruleSet.rrule(new RRule({
            freq: localTaskRrule.options.freq,
            interval: localTaskRrule.options.interval,
            byweekday: localTaskRrule.options.byweekday,
            until: localTaskRrule.options.until,
            dtstart: moment(nextRepeatingInstance).toDate(),
        }))

        console.log(task)
        console.log(updatedRruleSet.toString())
        console.log(nextRepeatingInstance)
        // await updateTaskMutation({
        //     variables: {
        //         id: task.id,
        //         date: nextRepeatingInstance,
        //         rrule: updatedRruleSet.toString(),
        //         endDate: task.endDate,
        //     },
        // })
        // .catch((error) => {
        //     setErrors(error.graphQLErrors?.[0].extensions.exception)
        // })

        // deleteFirstRepeatingInstanceMutation({
        //     variables: {
        //         taskId: task.id,
        //     },
        // })
        // .catch((error) => {
        //     setErrors(error.graphQLErrors?.[0].extensions.exception)
        // })
    }, [task.date, task.id, deleteFirstRepeatingInstanceMutation, updateTaskMutation, getRrule])

    // If task doesn't have a repeating instance, it is root task
    // Delete root and set next repeating instance as root
    const handleDeleteSingleInstance = useCallback(() => {
        !task.repeatingTaskInstances
            ? handleRootTaskDelete()
            : handleSingleRepeatingInstanceDelete()
    }, [handleSingleRepeatingInstanceDelete, task.repeatingTaskInstances, handleRootTaskDelete])

    const handleSubmit = useCallback(() => {
        toggleDeleteDialog()

        selectedOption === 'this'
            ? handleDeleteSingleInstance()
            : deleteTaskAndAllInstances()
    }, [selectedOption, handleDeleteSingleInstance, deleteTaskAndAllInstances, toggleDeleteDialog])

    return (
        <div className={'dialog ' + (isDeleteDialogOpen ? 'dialog--open' : 'dialog--closed')}>
            <div className="dialog__content">
                <div className="dialog__header-wrapper">
                    <p className="title">
                        <span role="img" aria-label="trash">🗑</span>️
                        Delete Task
                    </p>
                </div>
                <div
                    className="dialog__radio form__field-wrapper"
                    onClick={() => setSelectedOption('this')}
                >
                    <input
                        className="this"
                        onChange={() => setSelectedOption('this')}
                        value="this"
                        checked={selectedOption === 'this'}
                        type="radio"
                    />
                    <label
                        htmlFor="this"
                        className="dialog__radio-text"
                    >
                        This Task
                    </label>
                </div>
                <div
                    className="dialog__radio form__field-wrapper"
                    onClick={() => setSelectedOption('all')}
                >
                    <input
                        className="all"
                        onChange={() => setSelectedOption('all')}
                        value="all"
                        checked={selectedOption === 'all'}
                        type="radio"
                    />
                    <label
                        htmlFor="all"
                        className="dialog__radio-text"
                    >
                        All Tasks
                    </label>
                </div>
                {errors.error && <ErrorMessage error={errors.error} />}
                <div className="form__button-group--right">
                    <button
                        onClick={toggleDeleteDialog}
                        className="button button--secondary button-delete"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="button button--primary button-delete"
                        type="button"
                    >
                        {deleteLoading || updateLoading ? <ButtonLoadingIconBlue size={18} /> : 'Ok'}
                    </button>
                </div>
            </div>
        </div>
    )
}
