import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'
import { RRule } from 'rrule'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ButtonLoadingIconWhite } from '../../../../components/ButtonLoadingIconWhite'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { WeekDayButton } from '../../../../components/WeekDayButton'
import { DELETE_TASK, GET_TASKS_BY_DATE_AND_TASK_CARD, UPDATE_TASK } from '../../../../graphql/task/task'
import { deleteTaskResponse, deleteTaskVariables, TaskType, updateTaskResponse, updateTaskVariables } from '../../../../graphql/task/task.types'
import { rruleWeekDaysArr } from '../../../../util/helpers/variables'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { TaskDialogProps } from './TaskDialog.types'

export const TaskDialog: React.FC<TaskDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, task, taskCardId, taskRrule } = props

    const { selectedDate } = useSelector((state) => state.user)
    const [isRepeating, toggleIsRepeating] = useToggle(false)
    const [frequency, setFrequency] = useState<string>('2')
    const [interval, setInterval] = useState<number>(1)
    const [doesEnd, setDoesEnd] = useToggle(false)
    const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([])

    const [updateTaskMutation, { loading: updateLoading }] = useMutation<updateTaskResponse, updateTaskVariables>(UPDATE_TASK)
    const [deleteTaskMutation, { loading: deleteLoading }] = useMutation<deleteTaskResponse, deleteTaskVariables>(DELETE_TASK)

    // Form
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const { formValues, setFormValue, resetForm } = useFormFields({
        title: task.title,
        note: task.note ? task.note : '',
        date: new Date(task.date),
        isRepeating: task.isRepeating,
        endDate: task.endDate ? task.endDate : null,
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

    // Parse rrule to string
    const getRrule = useCallback(() => {
        const rule = new RRule({
            freq: frequency,
            interval,
            byweekday: [...selectedWeekDays],
            dtstart: formValues.date,
            until: formValues.endDate,
        })

        return rule.toString()
    }, [selectedWeekDays, interval, frequency, formValues.date, formValues.endDate])

    // Save task card
    const updateTask = useCallback(() => {
        updateTaskMutation({
            variables: {
                id: task.id,
                title: formValues.title,
                note: formValues.note,
                date: formValues.date,
                rrule: getRrule(),
                isRepeating,
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
        getRrule,
        isRepeating,
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
                    <div
                        className="form__field-wrapper"
                        onClick={toggleIsRepeating}
                    >
                        <input
                            type="checkbox"
                            checked={isRepeating}
                            className="task__checkbox"
                            onClick={(event) => event.stopPropagation()}
                            onChange={toggleIsRepeating}
                        />
                        <label
                            htmlFor="task__checkbox"
                            className="task__title"
                        >
                            Repeat Task
                        </label>
                    </div>
                    {isRepeating && (
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Every</p>
                            <div className="repeating-task__header">
                                <input
                                    className="form__input-field repeating-task__interval"
                                    type="number"
                                    min={1}
                                    value={interval}
                                    onChange={({ target }) => setInterval(parseInt(target.value, 10))}
                                />
                                {/* RRule parses frequency = month = 1, week = 2, day = 1, same with week days*/}
                                <select
                                    onChange={({ target }) => setFrequency(target.value)}
                                    defaultValue={frequency}
                                    className="form__input-field repeating-task__frequency"
                                >
                                    <option value={'3'}>{interval !== 1 ? 'Days' : 'Day'}</option>
                                    <option value={'2'}>{interval !== 1 ? 'Weeks' : 'Week'}</option>
                                    <option value={'1'}>{interval !== 1 ? 'Months' : 'Month'}</option>
                                </select>
                            </div>
                            {frequency === '2' && (
                                <div className="form__field-wrapper">
                                    <p className="form__field-title">On</p>
                                    <div className="repeating-task__weekdays">
                                        {rruleWeekDaysArr.map((day, index) => (
                                            <WeekDayButton
                                                weekDay={day}
                                                setSelectedWeekDays={setSelectedWeekDays}
                                                selectedWeekDays={selectedWeekDays}
                                                key={index}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="form__field-wrapper">
                                <input
                                    type="checkbox"
                                    checked={doesEnd}
                                    className="task-dialog__checkbox"
                                    onChange={setDoesEnd}
                                />
                                <label
                                    htmlFor="task-dialog__checkbox"
                                    className="task__title"
                                >
                                    Does End
                                </label>
                            </div>
                            <div className="form__field-wrapper">
                                {doesEnd && (
                                    <div className="form__field-wrapper">
                                        <p className="form__field-title">End Date</p>
                                        <DatePicker
                                            className="form__input-field"
                                            selected={formValues.endDate}
                                            onChange={(date) => setFormValue(date, 'endDate')}
                                            minDate={formValues.date}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
