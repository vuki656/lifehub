import { useMutation } from '@apollo/react-hooks'
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined'
import LoopIcon from '@material-ui/icons/Loop'
import NotesIcon from '@material-ui/icons/Notes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'
import { RRule, RRuleSet } from 'rrule'

import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { Message } from '../../../../components/Message'
import { WeekDayButton } from '../../../../components/WeekDayButton'
import { DELETE_TASK, GET_TASKS_BY_DATE_AND_TASK_CARD, TURN_OFF_REPEATING, UPDATE_TASK } from '../../../../graphql/task/task'
import {
    deleteTaskResponse,
    deleteTaskVariables,
    getTasksByDateAndTaskCardResponse,
    TaskType,
    turnOffRepeatingVariables,
    updateTaskResponse,
    updateTaskVariables,
} from '../../../../graphql/task/task.types'
import { toCompatibleDate } from '../../../../util/helpers/convertToCompatibleDate'
import { rruleWeekDaysArr } from '../../../../util/helpers/variables'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { TaskDeleteDialog } from '../TaskDeleteDialog'
import { TaskDialogProps } from './TaskDialog.types'

dayjs.extend(utc)

export const TaskDialog: React.FC<TaskDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, task, taskCardId, taskRRuleObj } = props
    const { options } = taskRRuleObj
    const { id: taskId, date, taskMetaData } = task
    const { title, note, id: taskMetaDataId } = taskMetaData

    const { selectedDate } = useSelector((state) => state.user)
    const [isDeleteDialogOpen, toggleDeleteDialog] = useToggle(false)
    const [isRepeatingAlertDialogOpen, toggleRepeatingAlertDialog] = useToggle(false)
    const [selectedTab, setSelectedTab] = useState('details')
    const [isRepeating, toggleIsRepeating] = useToggle(taskMetaData.isRepeating)
    const [isHabit, toggleIsHabit] = useToggle(taskMetaData.isHabit)

    // RRule
    const [doesEnd, setDoesEnd] = useToggle(!!taskMetaData.endDate)
    const [excludedDates, setExcludedDates] = useState<Date[]>([])
    const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>(options.byweekday ? options.byweekday : [])
    const [frequency, setFrequency] = useState<number>(options.freq === 0 ? 2 : options.freq) // 2 is week in select (check rrule source code)
    const [interval, setInterval] = useState<number>(options.interval ? options.interval : 1)

    const [updateTaskMutation, { loading: updateLoading }] = useMutation<updateTaskResponse, updateTaskVariables>(UPDATE_TASK)
    const [deleteTaskMutation, { loading: deleteLoading }] = useMutation<deleteTaskResponse, deleteTaskVariables>(DELETE_TASK)
    const [turnOffRepeatingMutation, { loading: turnOffRepeatingLoading }] = useMutation<{}, turnOffRepeatingVariables>(TURN_OFF_REPEATING)

    // Form
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const { formValues, setFormValue, resetForm } = useFormFields({
        title,
        note: note ? note : '',
        date: new Date(date),
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

    // Return a rruleset object with set needed props
    const getRrule = useCallback(() => {
        const rruleSet = new RRuleSet()

        // Set rruleset props
        rruleSet.rrule(new RRule({
            freq: frequency,
            interval,
            byweekday: frequency === 2 ? [...selectedWeekDays] : null, // 2 means weekly, if weekly, include selected weekdays
            dtstart: formValues.startDate,
            until: doesEnd ? formValues.endDate : null,
        }))

        // Apply existing excluded dates
        excludedDates.forEach((excludedDate) => {
            rruleSet.exdate(excludedDate)
        })

        return rruleSet
    }, [
        formValues.endDate,
        formValues.startDate,
        selectedWeekDays,
        interval,
        frequency,
        excludedDates,
        doesEnd,
    ])

    // Remove task from selected date view (cache) if task date doesn't match selected date
    const removeTaskIfNotInDateRange = useCallback((task: TaskType, cachedTaskList: TaskType[]) => {
        let isInRepeatingDateRange = false

        if (isRepeating) {

            // Get rrule date span
            const recurringSelectedDays: Date[] = getRrule().between(
                dayjs(formValues.startDate).toDate(),
                dayjs(formValues.endDate).toDate(),
                true,
            )

            // Check if selected date matches any of the rrule date span dates
            recurringSelectedDays.forEach((recurringSelectedDay) => {
                if (dayjs(selectedDate).isSame(recurringSelectedDay, 'date')) {
                    isInRepeatingDateRange = true
                }
            })
        }

        // If no matching dates found, remove from cache
        if (!isInRepeatingDateRange && !dayjs(task.date).isSame(selectedDate)) {
            return _.filter(cachedTaskList, ({ id }) => id !== task.id)
        }

        return cachedTaskList
    }, [
        selectedDate,
        formValues.startDate,
        formValues.endDate,
        getRrule,
        isRepeating,
    ])

    // Update task
    const updateTask = useCallback(() => {
        updateTaskMutation({
            variables: {
                input: {
                    id: taskId,
                    date: toCompatibleDate(formValues.date),
                    taskCard: taskCardId,
                    taskMetaData: {
                        id: taskMetaDataId,
                        title: formValues.title,
                        note: formValues.note,
                        startDate: isRepeating ? toCompatibleDate(formValues.startDate) : null,
                        endDate: doesEnd ? toCompatibleDate(formValues.endDate) : null,
                        rrule: isRepeating ? getRrule().toString() : null,
                        isRepeating,
                        isHabit,
                    },
                },
            },
            update(cache, response) {
                if (!response.data?.updateTask) return
                toggleDialog()
                const localCache = cache.readQuery<getTasksByDateAndTaskCardResponse>({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        input: {
                            taskCardId,
                            selectedDate,
                        },
                    },
                })
                const updatedList = removeTaskIfNotInDateRange(response.data?.updateTask.task, localCache?.getTasksByDateAndTaskCard.tasks!)
                cache.writeQuery<getTasksByDateAndTaskCardResponse>({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    data: {
                        getTasksByDateAndTaskCard: {
                            tasks: updatedList,
                            __typename: response.data?.updateTask.__typename,
                        },
                    },
                    variables: {
                        input: {
                            taskCardId,
                            selectedDate,
                        },
                    },
                })
            },
        })
        .catch((error) => {
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
        removeTaskIfNotInDateRange,
        selectedDate,
        toggleDialog,
        doesEnd,
    ])

    // Delete task
    const deleteTask = useCallback(() => {
        deleteTaskMutation({
            variables: {
                input: {
                    taskId: task.id!,
                    taskMetaDataId: task.taskMetaData.id,
                },
            },
            update(cache, response) {
                toggleDialog() // Has to be here to prevent call to unmounted (deleted) component
                if (!response.data?.deleteTask) return
                const localCache = cache.readQuery<getTasksByDateAndTaskCardResponse>({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        input: {
                            taskCardId,
                            selectedDate,
                        },
                    },
                })
                const updatedList = _.filter(localCache?.getTasksByDateAndTaskCard.tasks, (cachedTask) => (
                    cachedTask.id !== response.data?.deleteTask.taskId
                ))
                cache.writeQuery<getTasksByDateAndTaskCardResponse>({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    data: {
                        getTasksByDateAndTaskCard: {
                            tasks: updatedList,
                            __typename: response.data.deleteTask.__typename!,
                        },
                    },
                    variables: {
                        input: {
                            taskCardId,
                            selectedDate,
                        },
                    },
                })
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        deleteTaskMutation,
        task,
        selectedDate,
        taskCardId,
        toggleDialog,
    ])

    // Toggle is repeating and reset form if repeating status being set back to false
    const handleIsRepeatingToggle = useCallback(() => {

        // If its true, it means its being set from true to false, so reset form
        if (isRepeating) {
            setDoesEnd(false)
            setSelectedWeekDays([])
            setFrequency(2)
            setInterval(1)
            toggleIsHabit(false)
            setFormValue(new Date(selectedDate), 'startDate')
            setFormValue(new Date(selectedDate), 'endDate')
        }

        // If repeating being set back to false, toggle repeating alert
        if (task.taskMetaData.isRepeating && isRepeating) {
            toggleRepeatingAlertDialog()
        } else {
            toggleIsRepeating()
        }
    }, [
        setDoesEnd,
        setSelectedWeekDays,
        setFrequency,
        setInterval,
        setFormValue,
        isRepeating,
        toggleIsRepeating,
        selectedDate,
        toggleIsHabit,
        toggleRepeatingAlertDialog,
        task.taskMetaData.isRepeating,
    ])

    const handleIsRepeatingTurnOff = useCallback(() => {
        toggleIsRepeating()
        toggleRepeatingAlertDialog()
    }, [
        toggleIsRepeating,
        toggleRepeatingAlertDialog,
    ])

    // If its true, it means its being set from true to false
    // Repeating data and habit data exists, so warn user about that being deleted
    const turnOffRepeating = useCallback(() => {
        turnOffRepeatingMutation({
            variables: {
                input: {
                    taskId,
                    taskMetaDataId,
                },
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        turnOffRepeatingMutation,
        taskId,
        taskMetaDataId,
    ])

    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        if (!updateLoading || !deleteLoading) updateTask()
        if (task.taskMetaData.isRepeating && !isRepeating) turnOffRepeating()
    }, [
        updateTask,
        updateLoading,
        deleteLoading,
        turnOffRepeating,
        task.taskMetaData.isRepeating,
        isRepeating,
    ])

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
                            <button
                                onClick={task.taskMetaData.isRepeating ? toggleDeleteDialog : deleteTask}
                                className="button button--secondary"
                                type="button"
                            >
                                {deleteLoading
                                    ? <LoadingSpinner loaderColor={'blue'} loaderVariant={'button'} />
                                    : 'Delete'
                                }
                            </button>
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
                                <>
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
                                    <button
                                        className={
                                            'button button--secondary dialog__navigation-button '
                                            + (selectedTab === 'habit' && 'dialog__navigation-button--selected')
                                        }
                                        type="button"
                                        onClick={() => setSelectedTab('habit')}
                                    >
                                        <AssignmentTurnedInOutlinedIcon className="dialog__button-icon" />
                                        <p className="dialog__button-text">Habit</p>
                                    </button>
                                </>
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
                                            maxDate={isRepeating ? formValues.endDate : null}
                                            required
                                        />
                                    </div>
                                    <div className="form__field-wrapper">
                                        <div
                                            className="dialog__checkbox"
                                            onClick={handleIsRepeatingToggle}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isRepeating}
                                                className="task__checkbox"
                                                onClick={(event) => event.stopPropagation()}
                                                onChange={handleIsRepeatingToggle}
                                            />
                                            <label
                                                htmlFor="task__checkbox"
                                                className="task__title"
                                            >
                                                Repeat Task
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
                                            {/* RRule parses frequency = month = 1, week = 2, day = 3, same with week days*/}
                                            <select
                                                onChange={({ target }) => setFrequency(parseInt(target.value, 10))}
                                                value={frequency}
                                                className="form__input-field repeating-task__frequency"
                                            >
                                                <option value={3}>{interval !== 1 ? 'Days' : 'Day'}</option>
                                                <option value={2}>{interval !== 1 ? 'Weeks' : 'Week'}</option>
                                                <option value={1}>{interval !== 1 ? 'Months' : 'Month'}</option>
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
                                                maxDate={dayjs(formValues.endDate).isSame(new Date()) ? null : formValues.endDate}
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
                            {selectedTab === 'habit' && (
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
                                    <Message
                                        message="If checked, you can track how consistent you are with your
                                        habits as well as some other neat info about it."
                                        type="info"
                                    />
                                </div>
                            )}
                        </div>
                        {errors.error && <Message message={errors.error} type="error" />}
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
                                {updateLoading || turnOffRepeatingLoading
                                    ? <LoadingSpinner loaderColor={'white'} loaderVariant={'button'} />
                                    : 'Save'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {isRepeatingAlertDialogOpen && (
                <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                    <div className="dialog__content">
                        <div className="dialog__header-wrapper">
                            <p className="title">
                                <span role="img" aria-label="trash">📋</span>️
                                Turn off repeating
                            </p>
                        </div>
                        <div className="dialog__text">
                            <Message
                                message="  If you set repeating back to false, you will lose all your habit statistics related to this task.
                                If you wish to just stop repeating this task you can set the end date to today and it will not repeat any more."
                                type="info"
                            />
                        </div>
                        {errors.error && <Message message={errors.error} type="error" />}
                        <div className="form__button-group--right">
                            <button
                                onClick={toggleRepeatingAlertDialog}
                                className="button button--secondary button-delete"
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleIsRepeatingTurnOff}
                                className="button button--primary button-delete"
                                type="button"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <TaskDeleteDialog
                isDeleteDialogOpen={isDeleteDialogOpen}
                toggleDeleteDialog={toggleDeleteDialog}
                taskCardId={taskCardId}
                task={task}
                getRrule={getRrule}
            />
        </>
    )
}
