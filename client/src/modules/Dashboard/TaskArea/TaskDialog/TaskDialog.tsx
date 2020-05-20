import { useMutation } from '@apollo/react-hooks'
import LoopIcon from '@material-ui/icons/Loop'
import NotesIcon from '@material-ui/icons/Notes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import _ from 'lodash'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'
import { RRule, RRuleSet } from 'rrule'

import { ButtonLoadingIconWhite } from '../../../../components/ButtonLoadingIconWhite'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { WeekDayButton } from '../../../../components/WeekDayButton'
import { UPDATE_TASK } from '../../../../graphql/task/task'
import { TaskType, updateTaskResponse, updateTaskVariables } from '../../../../graphql/task/task.types'
import { toUTC } from '../../../../util/helpers/convertToUtcDayStart'
import { rruleWeekDaysArr } from '../../../../util/helpers/variables'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { TaskDialogProps } from './TaskDialog.types'

dayjs.extend(utc)

export const TaskDialog: React.FC<TaskDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, task, taskCardId, taskRRuleObj } = props
    const { options } = taskRRuleObj
    const { id: taskId, date, taskMetaData } = task
    const { title, note, id: taskMetaDataId } = taskMetaData

    const { selectedDate } = useSelector((state) => state.user)
    const [isDeleteDialogOpen, toggleDeleteDialog] = useToggle(false)
    const [selectedTab, setSelectedTab] = useState('details')
    const [isRepeating, toggleIsRepeating] = useToggle(true)
    // const [isRepeating, toggleIsRepeating] = useToggle(taskMetaData.isRepeating)
    const [isHabit, toggleIsHabit] = useToggle(taskMetaData.isHabit)

    // RRule
    const [doesEnd, setDoesEnd] = useToggle(!!taskMetaData.endDate)
    const [excludedDates, setExcludedDates] = useState<Date[]>([])
    const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>(options.byweekday ? options.byweekday : [])
    const [frequency, setFrequency] = useState<number>(options.freq ? options.freq : 3) // 2 is week in select
    // const [frequency, setFrequency] = useState<number>(options.freq ? options.freq : 2) // 2 is week in select
    const [interval, setInterval] = useState<number>(options.interval ? options.interval : 1)

    const [updateTaskMutation, { loading: updateLoading }] = useMutation<updateTaskResponse, updateTaskVariables>(UPDATE_TASK)

    // Form
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const { formValues, setFormValue, resetForm } = useFormFields({
        title,
        note: note ? note : '',
        date: new Date(date),
        isRepeating: taskMetaData.isRepeating,
        startDate: taskMetaData.startDate ? new Date(taskMetaData.startDate) : new Date(selectedDate),
        endDate: taskMetaData.endDate ? new Date(taskMetaData.endDate) : new Date(selectedDate),
    })

    useEffect(() => {
        // Set exclusion dates if exists, 'in' check has to exists bcs typescript
        if ('_exdate' in taskRRuleObj && taskRRuleObj._exdate) setExcludedDates(taskRRuleObj._exdate)
    }, [taskRRuleObj])

    // Clear errors, reset form and toggle dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        setErrors({})
        resetForm()

        // If its not delayed, then you can see reset happening
        setTimeout(() => {
            toggleIsRepeating(taskMetaData.isRepeating)
            setInterval(options.interval ? options.interval : 1)
            setDoesEnd(!!taskMetaData.endDate)
            setSelectedWeekDays(options.byweekday ? options.byweekday : [])
            setFrequency(options.freq ? options.freq : 2)
        }, 300)
    }, [
        toggleDialog,
        resetForm,
        setDoesEnd,
        taskMetaData.isRepeating,
        taskMetaData.endDate,
        options.byweekday,
        toggleIsRepeating,
        options.interval,
        options.freq,
    ])

    const getRrule = useCallback(() => {
        const rruleSet = new RRuleSet()

        rruleSet.rrule(new RRule({
            freq: frequency,
            interval,
            byweekday: [...selectedWeekDays],
            dtstart: toUTC(formValues.startDate),
            until: doesEnd ? toUTC(formValues.endDate) : null,
        }))

        // Apply existing excluded dates
        excludedDates.forEach((excludedDate) => {
            rruleSet.exdate(excludedDate)
        })

        return rruleSet
    }, [selectedWeekDays, interval, frequency, formValues.startDate, formValues.endDate, excludedDates])

    // Remove task from selected date view if task date or repeating instances doesn't match selected date
    const removeTaskIfNotInDateRange = useCallback((task: TaskType, cachedTaskList: TaskType[]) => {
        let isInRepeatingDateRange = false

        // Get rrule date span
        const recurringSelectedDays: Date[] = getRrule().between(
            moment(formValues.startDate).toDate(),
            moment(formValues.endDate).toDate(),
            true,
        )

        // Check if selected date in rrule date span
        recurringSelectedDays.forEach((recurringSelectedDay) => {
            if (moment(selectedDate).isSame(recurringSelectedDay)) {
                isInRepeatingDateRange = true
            }
        })

        // If selected date not in recurring dates and root task date, remove it from selected date cache so not in view
        if (
            !moment(selectedDate).isSame(task.date) &&
            !isInRepeatingDateRange
        ) {
            return _.filter(cachedTaskList, ({ id }) => (
                id !== task.id
            ))
        }

        return cachedTaskList
    }, [selectedDate, formValues.startDate, formValues.endDate, getRrule])

    // Update task
    const updateTask = useCallback(() => {
        console.log(formValues)
        console.log(doesEnd)

        updateTaskMutation({
            variables: {
                input: {
                    id: taskId,
                    date: toUTC(formValues.date),
                    taskCard: taskCardId,
                    taskMetaData: {
                        id: taskMetaDataId,
                        title: formValues.title,
                        note: formValues.note,
                        startDate: toUTC(formValues.startDate),
                        endDate: doesEnd ? toUTC(formValues.endDate) : null,
                        rrule: getRrule().toString(),
                        isRepeating,
                        isHabit,
                    },
                },
            },
            // update(cache, { data }) {
            //     toggleDialog()
            //     const { getTasksByDateAndTaskCard }: any = cache.readQuery({
            //         query: GET_TASKS_BY_DATE_AND_TASK_CARD,
            //         variables: {
            //             taskCardId,
            //             selectedDate,
            //         },
            //     })
            //     const updatedList = removeTaskIfNotInDateRange(data?.updateTask!, getTasksByDateAndTaskCard)
            //     cache.writeQuery({
            //         query: GET_TASKS_BY_DATE_AND_TASK_CARD,
            //         data: { getTasksByDateAndTaskCard: updatedList },
            //         variables: {
            //             taskCardId,
            //             selectedDate,
            //         },
            //     })
            // },
        })
        .catch((error) => {
            console.log(error)
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        formValues.title,
        formValues.note,
        formValues.date,
        formValues.startDate,
        formValues.endDate,
        taskId,
        taskMetaDataId,
        taskCardId,
        getRrule,
        isRepeating,
        isHabit,
        updateTaskMutation,
    ])

    // Delete task
    // const deleteTask = useCallback(() => {
    //     deleteTaskMutation({
    //         variables: {
    //             id: task?.id!,
    //         },
    //         update(cache, { data }) {
    //             handleDialogToggle() // Has to be here to prevent call to unmounted (deleted) component
    //             const { getTasksByDateAndTaskCard }: any = cache.readQuery({
    //                 query: GET_TASKS_BY_DATE_AND_TASK_CARD,
    //                 variables: {
    //                     taskCardId,
    //                     selectedDate,
    //                 },
    //             })
    //             const updatedList = _.filter(getTasksByDateAndTaskCard, ({ id }) => (
    //                 id !== data?.deleteTask.id
    //             ))
    //             cache.writeQuery({
    //                 query: GET_TASKS_BY_DATE_AND_TASK_CARD,
    //                 data: { getTasksByDateAndTaskCard: updatedList },
    //                 variables: {
    //                     taskCardId,
    //                     selectedDate,
    //                 },
    //             })
    //         },
    //     })
    //     .catch((error) => {
    //         setErrors(error.graphQLErrors?.[0].extensions.exception)
    //     })
    // }, [deleteTaskMutation, task, selectedDate, handleDialogToggle, taskCardId])

    // If reminder exists update, else create
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        updateTask()
    }, [updateTask])

    return (
        <>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                    <div className="dialog__content">
                        <div className="dialog__header-wrapper">
                            <p className="title">
                                <span role="img" aria-label="pencil">✏️ </span>
                                Update Task
                            </p>
                            {/*<button*/}
                            {/*    onClick={task.taskMetaData.isRepeating ? toggleDeleteDialog : deleteTask}*/}
                            {/*    className="button button--secondary"*/}
                            {/*    type="button"*/}
                            {/*>*/}
                            {/*    {deleteLoading ? <ButtonLoadingIconBlue size={18} /> : 'Delete'}*/}
                            {/*</button>*/}
                        </div>
                        <div className="dialog__navigation">
                            <button
                                className={
                                    'button button--secondary dialog__navigation-button '
                                    + (selectedTab === 'details' && 'dialog__navigation-button--selected')
                                }
                                type="button"
                                onClick={() => setSelectedTab('details')}
                            >
                                <NotesIcon className="dialog__button-icon" />
                                <p className="dialog__button-text">Details</p>
                            </button>
                            {isRepeating && (
                                <button
                                    className={
                                        'button button--secondary dialog__navigation-button '
                                        + (selectedTab === 'repeat' && 'dialog__navigation-button--selected')
                                    }
                                    type="button"
                                    onClick={() => setSelectedTab('repeat')}
                                >
                                    <LoopIcon className="dialog__button-icon" />
                                    <p className="dialog__button-text">Repeat</p>
                                </button>
                            )}
                        </div>
                        <div className="dialog__main-wrapper">
                            {selectedTab === 'details' && (
                                <div>
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
                                            maxDate={formValues.endDate}
                                            required
                                        />
                                    </div>
                                    <div className="form__field-wrapper">
                                        <div
                                            className="dialog__checkbox"
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
                                    </div>
                                    <div className="form__field-wrapper">
                                        <div
                                            className="dialog__checkbox"
                                            onClick={toggleIsHabit}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isHabit}
                                                className="task__checkbox"
                                                onClick={(event) => event.stopPropagation()}
                                                onChange={toggleIsHabit}
                                            />
                                            <label
                                                htmlFor="task__checkbox"
                                                className="task__title"
                                            >
                                                Is Habit
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedTab === 'repeat' && (
                                <div>
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
                                                onChange={({ target }) => setFrequency(parseInt(target.value, 10))}
                                                value={frequency}
                                                className="form__input-field repeating-task__frequency"
                                            >
                                                <option value={1}>{interval !== 1 ? 'Months' : 'Month'}</option>
                                                <option value={2}>{interval !== 1 ? 'Weeks' : 'Week'}</option>
                                                <option value={3}>{interval !== 1 ? 'Days' : 'Day'}</option>
                                            </select>
                                        </div>
                                        {frequency === 2 && (// 2 = weekly so display week days
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
                                            <p className="form__field-title">Start Date</p>
                                            <DatePicker
                                                required
                                                className="form__input-field"
                                                selected={formValues.startDate}
                                                onChange={(date) => setFormValue(date, 'startDate')}
                                                minDate={new Date()}
                                            />
                                        </div>
                                        <div className="form__field-wrapper">
                                            <div
                                                className="dialog__checkbox"
                                                onClick={setDoesEnd}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={doesEnd}
                                                    className="task-dialog__checkbox"
                                                    onClick={(event) => event.stopPropagation()}
                                                    onChange={setDoesEnd}
                                                />
                                                <label
                                                    htmlFor="task-dialog__checkbox"
                                                    className="task__title"
                                                >
                                                    Does End
                                                </label>
                                            </div>
                                        </div>
                                        {doesEnd && (
                                            <div className="form__field-wrapper">
                                                <p className="form__field-title">End Date</p>
                                                <DatePicker
                                                    required={doesEnd}
                                                    className="form__input-field"
                                                    selected={formValues.endDate}
                                                    onChange={(date) => setFormValue(date, 'endDate')}
                                                    minDate={formValues.startDate}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
            {/*<TaskDeleteDialog*/}
            {/*    isDeleteDialogOpen={isDeleteDialogOpen}*/}
            {/*    toggleDeleteDialog={toggleDeleteDialog}*/}
            {/*    task={task}*/}
            {/*    deleteTaskAndAllInstances={deleteTask}*/}
            {/*    getRrule={getRrule}*/}
            {/*/>*/}
        </>
    )
}
