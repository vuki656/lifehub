import { useMutation } from '@apollo/react-hooks'
import React, { useState } from 'react'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { DELETE_FIRST_REPEATING_INSTANCE, DELETE_REPEATING_TASK_INSTANCE } from '../../../../graphql/repeatingTaskInstance/repeatingTaskInstance'
import {
    deleteFirstRepeatingInstanceResponse,
    deleteFirstRepeatingInstanceVariables,
    deleteRepeatingTaskInstanceResponse,
    deleteRepeatingTaskInstanceVariables,
} from '../../../../graphql/repeatingTaskInstance/repeatingTaskInstance.types'
import { TaskDeleteDialogProps } from './TaskDeleteDialog.types'

export const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = (props) => {
    const {
        isDeleteDialogOpen,
        toggleDeleteDialog,
        deleteTaskAndAllInstances,
        task,
        getRrule,
    } = props

    const [selectedOption, setSelectedOption] = useState('this')
    const [errors, setErrors] = React.useState<{ error?: string }>({})

    // TODO: rename loading var
    // const [updateTaskMutation, { loading: updateLoading }] = useMutation(UPDATE_TASK)
    const [deleteFirstRepeatingInstanceMutation, { loading: deleteLoading2 }]
        = useMutation<deleteFirstRepeatingInstanceResponse, deleteFirstRepeatingInstanceVariables>(DELETE_FIRST_REPEATING_INSTANCE)
    const [deleteRepeatingTaskInstanceMutation, { loading: deleteLoading }]
        = useMutation<deleteRepeatingTaskInstanceResponse, deleteRepeatingTaskInstanceVariables>(DELETE_REPEATING_TASK_INSTANCE)

    // const handleSingleRepeatingInstanceDelete = useCallback(async () => {
    //     const localTaskRrule = getRrule()
    //
    //     // Set deleted task date as excluded in rrule so its not created anymore, check mandatory bcz typescript
    //     if (localTaskRrule instanceof RRuleSet) localTaskRrule.exdate(moment(task.repeatingTaskInstances[0].date).toDate())
    //
    //     await deleteRepeatingTaskInstanceMutation({
    //         variables: {
    //             repeatingTaskInstanceId: task.repeatingTaskInstances[0].id,
    //             taskId: task.id,
    //             rruleStrWithUpdatedExclusions: localTaskRrule.toString(),
    //         },
    //     }) // TODO: update cache
    //     .then(() => {
    //         toggleDeleteDialog()
    //     })
    //     .catch((error) => {
    //         setErrors(error.graphQLErrors?.[0].extensions.exception)
    //     })
    // }, [task.repeatingTaskInstances, task.id, getRrule, deleteRepeatingTaskInstanceMutation, toggleDeleteDialog])
    //
    // // Change root task date to date of next repeating instance, delete that instance
    // const handleRootTaskDelete = useCallback(async () => {
    //     const rruleSet: RRuleSet | RRule = getRrule()
    //
    //     if ('_rrule' in rruleSet) {
    //         const nextRepeatingInstance = rruleSet._rrule[0].after(moment(task.date).toDate())
    //
    //         // Clone the old rrule and add new start date to it
    //         const updatedRruleSet = new RRuleSet()
    //         updatedRruleSet.rrule(new RRule({
    //             freq: rruleSet._rrule[0].options.freq,
    //             interval: rruleSet._rrule[0].options.interval,
    //             byweekday: rruleSet._rrule[0].options.byweekday,
    //             until: rruleSet._rrule[0].options.until,
    //             dtstart: moment(nextRepeatingInstance).toDate(),
    //         }))
    //
    //         // Set deleted task date as excluded in rrule so its not created anymore, and add existing ones
    //         // Check mandatory bcz typescript
    //         updatedRruleSet.exdate(moment(task.date).toDate())
    //         rruleSet.exdates().forEach((excludedDate) =>
    //             updatedRruleSet.exdate(excludedDate),
    //         )
    //
    //         await deleteFirstRepeatingInstanceMutation({
    //             variables: {
    //                 taskId: task.id,
    //             },
    //         })
    //         .catch((error) => {
    //             setErrors(error.graphQLErrors?.[0].extensions.exception)
    //         })
    //
    //         await updateTaskMutation({
    //             variables: {
    //                 id: task.id,
    //                 date: nextRepeatingInstance,
    //                 rrule: updatedRruleSet.toString(),
    //                 endDate: task.endDate,
    //             },
    //         })
    //         .catch((error) => {
    //             setErrors(error.graphQLErrors?.[0].extensions.exception)
    //         })
    //     }
    // }, [task.date, getRrule, deleteFirstRepeatingInstanceMutation, updateTaskMutation, task])
    //
    // // If task doesn't have a repeating instance, it is root task
    // // Delete root and set next repeating instance as root
    // const handleDeleteSingleInstance = useCallback(async () => {
    //     _.isEmpty(task.repeatingTaskInstances)
    //         ? await handleRootTaskDelete()
    //         : await handleSingleRepeatingInstanceDelete()
    // }, [handleSingleRepeatingInstanceDelete, handleRootTaskDelete, task])
    //
    // const handleSubmit = useCallback(() => {
    //     toggleDeleteDialog()
    //
    //     selectedOption === 'this'
    //         ? handleDeleteSingleInstance()
    //         : deleteTaskAndAllInstances()
    // }, [selectedOption, handleDeleteSingleInstance, deleteTaskAndAllInstances, toggleDeleteDialog])

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
                        // onClick={handleSubmit}
                        className="button button--primary button-delete"
                        type="button"
                    >
                        {/*{deleteLoading || updateLoading ? <ButtonLoadingIconBlue size={18} /> : 'Ok'}*/}
                    </button>
                </div>
            </div>
        </div>
    )
}
