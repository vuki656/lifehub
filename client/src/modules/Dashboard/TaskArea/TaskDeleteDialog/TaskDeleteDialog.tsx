import { useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { RRuleSet } from 'rrule'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { DELETE_REPEATING_TASK_INSTANCE } from '../../../../graphql/repeatingTaskInstance/repeatingTaskInstance'
import {
    deleteRepeatingTaskInstanceResponse,
    deleteRepeatingTaskInstanceVariables,
} from '../../../../graphql/repeatingTaskInstance/repeatingTaskInstance.types'
import { TaskDeleteDialogProps } from './TaskDeleteDialog.types'

export const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = (props) => {
    const { isDeleteDialogOpen, toggleDeleteDialog, deleteTaskAndAllInstances, task, taskRrule } = props

    const [selectedOption, setSelectedOption] = useState('this')
    const [errors, setErrors] = React.useState<{ error?: string }>({})

    const [deleteRepeatingTaskInstanceMutation, { loading: deleteLoading }]
        = useMutation<deleteRepeatingTaskInstanceResponse, deleteRepeatingTaskInstanceVariables>(DELETE_REPEATING_TASK_INSTANCE)

    const handleSingleRepeatingInstanceDelete = useCallback(() => {
        // Set deleted task date as excluded so its not created anymore
        if (taskRrule instanceof RRuleSet) taskRrule.exdate(moment(task.repeatingTaskInstances[0].date).toDate())

        // FIGURE OUT WHAT TO DO ABOUT THE RRULE HOOK IN PARENT
        // HOW ARE YOU GOIN TO CLEANLY TIE THAT INTO THIS ONE

        deleteRepeatingTaskInstanceMutation({
            variables: {
                repeatingTaskInstanceId: task.repeatingTaskInstances[0].id,
                taskId: task.id,
                rruleStrWithUpdatedExclusions: taskRrule.toString(),
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [task.repeatingTaskInstances, task.id, taskRrule, deleteRepeatingTaskInstanceMutation])

    const handleDeleteSingleInstance = useCallback(() => {
        // If task doesn't have a repeating instance, it means its a root task
        if (!task.repeatingTaskInstances) {
            const nextRepeatingInstance = taskRrule.after(task.date)

            // Set a new date of task to next repeating instance
            // Delete that next repeating instance so there aren't duplicated
        } else {
            handleSingleRepeatingInstanceDelete()
        }
    }, [handleSingleRepeatingInstanceDelete, task.date, task.repeatingTaskInstances, taskRrule])

    const deleteAllInstances = useCallback(() => {
        deleteTaskAndAllInstances()
    }, [deleteTaskAndAllInstances])

    const handleSubmit = useCallback(() => {
        toggleDeleteDialog()
        selectedOption === 'this' ? handleDeleteSingleInstance() : deleteAllInstances()
    }, [selectedOption, handleDeleteSingleInstance, deleteAllInstances, toggleDeleteDialog])

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
                        {deleteLoading ? <ButtonLoadingIconBlue size={18} /> : 'Ok'}
                    </button>
                </div>
            </div>
        </div>
    )
}
