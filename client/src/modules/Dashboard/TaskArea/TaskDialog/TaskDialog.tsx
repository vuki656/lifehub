import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'
import moment from 'moment'
import React, { useCallback } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ButtonLoadingIconWhite } from '../../../../components/ButtonLoadingIconWhite'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { DELETE_TASK, GET_TASKS_BY_DATE_AND_TASK_CARD, UPDATE_TASK } from '../../../../graphql/task/task'
import { deleteTaskResponse, deleteTaskVariables, TaskType, updateTaskResponse, updateTaskVariables } from '../../../../graphql/task/task.types'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { TaskDialogProps } from './TaskDialog.types'

export const TaskDialog: React.FC<TaskDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, task, taskCardId } = props

    const { selectedDate } = useSelector((state) => state.user)
    const [updateTaskMutation, { loading: updateLoading }] = useMutation<updateTaskResponse, updateTaskVariables>(UPDATE_TASK)
    const [deleteTaskMutation, { loading: deleteLoading }] = useMutation<deleteTaskResponse, deleteTaskVariables>(DELETE_TASK)

    // Form
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const [formValues, setFormValue, __, resetForm] = useFormFields({
        title: task.title,
        note: task.note ? task.note : '',
        date: new Date(task.date),
    })

    // Clear errors and toggle dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        resetForm()
        setErrors({})
    }, [toggleDialog, resetForm])

    // Remove task from selected date view if task date doesn't match it
    const removeTaskIfNotInSelectedDate = useCallback((task: TaskType, cachedTaskList: TaskType[]) => {
        if (!moment(selectedDate).isSame(task.date)) {
            return _.filter(cachedTaskList, ({ id }) => (
                id !== task.id
            ))
        }

        return cachedTaskList
    }, [selectedDate])

    // Save task card
    const updateTask = useCallback(() => {
        updateTaskMutation({
            variables: {
                id: task.id,
                title: formValues.title,
                note: formValues.note,
                date: formValues.date,
            },
            update(cache, { data }) {
                toggleDialog()
                const { getTasksByDateAndTaskCard }: any = cache.readQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        taskCardId,
                        selectedDate,
                    },
                })
                const updatedList = removeTaskIfNotInSelectedDate(data?.updateTask!, getTasksByDateAndTaskCard)
                cache.writeQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    data: { getTasksByDateAndTaskCard: updatedList },
                    variables: {
                        taskCardId,
                        selectedDate,
                    },
                })
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        updateTaskMutation,
        task.id,
        formValues.title,
        formValues.note,
        formValues.date,
        toggleDialog,
        selectedDate,
        removeTaskIfNotInSelectedDate,
        taskCardId,
    ])

    // Delete task
    const deleteTask = useCallback(() => {
        deleteTaskMutation({
            variables: {
                id: task?.id!,
            },
            update(cache, { data }) {
                handleDialogToggle() // Has to be here to prevent call to unmounted (deleted) component
                const { getTasksByDateAndTaskCard }: any = cache.readQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        taskCardId,
                        selectedDate,
                    },
                })
                const updatedList = _.filter(getTasksByDateAndTaskCard, ({ id }) => (
                    id !== data?.deleteTask.id
                ))
                cache.writeQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    data: { getTasksByDateAndTaskCard: updatedList },
                    variables: {
                        taskCardId,
                        selectedDate,
                    },
                })
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [deleteTaskMutation, task, selectedDate, handleDialogToggle, taskCardId])

    // If reminder exists update, else create
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        updateTask()
    }, [updateTask])

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                <div className="dialog__content">
                    <div className="dialog__header-wrapper">
                        <p className="title">
                            <span role="img" aria-label="pencil">✏️ </span>
                            Update Task
                        </p>
                        <button
                            onClick={deleteTask}
                            className="button button--secondary button-delete"
                            type="button"
                        >
                            {deleteLoading ? <ButtonLoadingIconBlue size={18} /> : 'Delete'}
                        </button>
                    </div>
                    <div className="form__input-wrapper">
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Title</p>
                            <input
                                className="form__input-field"
                                type="text"
                                required
                                value={formValues.title}
                                onChange={({ target }) => setFormValue(target.value, 'title')}
                                maxLength={150}
                            />
                        </div>
                    </div>
                    <div className="form__field-wrapper">
                        <p className="form__field-title">Note</p>
                        <textarea
                            className="form__input-field form__input-area"
                            rows={8}
                            value={formValues.note}
                            onChange={({ target }) => setFormValue(target.value, 'note')}
                            maxLength={2000}
                        />
                    </div>
                    <div className="form__field-wrapper">
                        <p className="form__field-title">Date</p>
                        <DatePicker
                            className="form__input-field"
                            selected={formValues.date}
                            onChange={(date) => setFormValue(date, 'date')}
                            minDate={new Date()}
                            required
                        />
                    </div>
                    {errors.error && <ErrorMessage error={errors.error} />}
                    <div className="form__button-group--right">
                        <button
                            onClick={handleDialogToggle}
                            className="form__button button button--secondary"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="form__button button button--primary"
                        >
                            {updateLoading ? <ButtonLoadingIconWhite /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
