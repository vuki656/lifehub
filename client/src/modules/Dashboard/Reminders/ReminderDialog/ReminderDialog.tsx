import { useMutation } from '@apollo/react-hooks'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import _ from 'lodash'
import React, { useCallback } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'

import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { Message } from '../../../../components/Message'
import {
    CREATE_REMINDER,
    DELETE_REMINDER,
    GET_REMINDERS_BY_DATE,
    UPDATE_REMINDER,
} from '../../../../graphql/reminder/reminder'
import {
    createReminderResponse,
    createReminderVariables,
    deleteReminderResponse,
    deleteReminderVariables,
    getRemindersByDateResponse,
    updateReminderResponse,
    updateReminderVariables,
} from '../../../../graphql/reminder/reminder.types'
import { toCompatibleDate } from '../../../../util/helpers/convertToCompatibleDate'
import { sortRemindersByDate } from '../../../../util/helpers/sortRemindersByDate'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'

import { ReminderDialogProps } from './ReminderDialog.types'

dayjs.extend(isBetween)

export const ReminderDialog: React.FC<ReminderDialogProps> = (props) => {
    const {
        isDialogOpen,
        toggleDialog,
        reminder,
    } = props

    const {
        username,
        selectedDate,
    } = useSelector((state) => state.user)
    const [createReminderMutation, { loading: createLoading }] = useMutation<createReminderResponse, createReminderVariables>(CREATE_REMINDER)
    const [updateReminderMutation, { loading: updateLoading }] = useMutation<updateReminderResponse, updateReminderVariables>(UPDATE_REMINDER)
    const [deleteReminderMutation, { loading: deleteLoading }] = useMutation<deleteReminderResponse, deleteReminderVariables>(DELETE_REMINDER)

    // Form
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const {
        formValues, setFormValue, clearForm, resetForm,
    } = useFormFields({
        description: reminder?.description ? reminder.description : '',
        endDate: reminder ? new Date(reminder.endDate) : undefined,
        startDate: reminder ? new Date(reminder.startDate) : new Date(selectedDate),
        title: reminder ? reminder.title : '',
    })

    // Clear errors and toggle dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        resetForm()
        setErrors({})
    }, [
        toggleDialog,
        resetForm,
    ])

    // Remove reminder from cache if the updated date range doesnt't contain selected date
    // Cache should contain only reminders for selected day
    const removeFromTodayIfOutOfRange = useCallback((reminder, cachedReminders) => {
        const {
            startDate,
            endDate,
        } = reminder

        if (!dayjs(selectedDate).isBetween(startDate, endDate)) {
            return _.filter(cachedReminders, ({ id }) => id !== reminder.id)
        }

        return cachedReminders
    }, [selectedDate])

    // Save reminder
    const createReminder = useCallback(() => {
        createReminderMutation({
            update(cache, response) {
                // If selected day in between reminder date range, display it in view
                if (
                    dayjs(selectedDate).isBetween(
                        response.data?.createReminder.startDate!,
                        response.data?.createReminder.endDate!,
                        'date',
                        '[]', // Indicates inclusion of edge date (start/end)
                    )
                ) {
                    const localCache = cache.readQuery<getRemindersByDateResponse>({
                        query: GET_REMINDERS_BY_DATE,
                        variables: {
                            selectedDate,
                            username,
                        },
                    })
                    const updatedList = _.concat(localCache?.getRemindersByDate, { ...response.data?.createReminder })
                    cache.writeQuery<getRemindersByDateResponse>({
                        data: { getRemindersByDate: sortRemindersByDate(updatedList) },
                        query: GET_REMINDERS_BY_DATE,
                        variables: {
                            selectedDate,
                            username,
                        },
                    })
                }
            },
            variables: {
                description: formValues.description,
                endDate: toCompatibleDate(formValues.endDate),
                startDate: toCompatibleDate(formValues.startDate),
                title: formValues.title,
                username,
            },
        })
        .then(() => {
            handleDialogToggle()
            clearForm()
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        clearForm,
        handleDialogToggle,
        createReminderMutation,
        username,
        formValues.endDate,
        formValues.startDate,
        formValues.title,
        formValues.description,
        selectedDate,
    ])

    // Update reminder
    const updateReminder = useCallback(() => {
        updateReminderMutation({
            update(cache, response) {
                toggleDialog()
                const localCache = cache.readQuery<getRemindersByDateResponse>({
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        selectedDate,
                        username,
                    },
                })
                const updatedList = removeFromTodayIfOutOfRange(response.data?.updateReminder, localCache?.getRemindersByDate)
                cache.writeQuery<getRemindersByDateResponse>({
                    data: { getRemindersByDate: sortRemindersByDate(updatedList) },
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        selectedDate,
                        username,
                    },
                })
            },
            variables: {
                description: formValues.description,
                endDate: toCompatibleDate(formValues.endDate),
                id: reminder?.id!,
                startDate: toCompatibleDate(formValues.startDate),
                title: formValues.title,
                username,
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        removeFromTodayIfOutOfRange,
        updateReminderMutation,
        formValues.description,
        formValues.title,
        selectedDate,
        toggleDialog,
        formValues.startDate,
        reminder,
        username,
        formValues.endDate,
    ])

    // If reminder exists update, else create
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        reminder ? updateReminder() : createReminder()
    }, [
        reminder,
        createReminder,
        updateReminder,
    ])

    // Delete reminder
    const deleteReminder = useCallback(() => {
        deleteReminderMutation({
            update(cache, response) {
                handleDialogToggle() // Has to be here to prevent call to unmounted (deleted) component
                const localCache = cache.readQuery<getRemindersByDateResponse>({
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        selectedDate,
                        username,
                    },
                })
                const updatedList = _.filter(localCache?.getRemindersByDate, ({ id }) => (
                    id !== response.data?.deleteReminder.id
                ))
                cache.writeQuery<getRemindersByDateResponse>({
                    data: { getRemindersByDate: sortRemindersByDate(updatedList) },
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        selectedDate,
                        username,
                    },
                })
            },
            variables: { id: reminder?.id! },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        deleteReminderMutation,
        reminder,
        selectedDate,
        username,
        handleDialogToggle,
    ])

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                <div className="dialog__content">
                    <div className="dialog__header-wrapper">
                        {reminder
                            ? (
                                <p className="title">
                                    <span role="img" aria-label="pencil">✏️ </span>
                                    Update Reminder
                                </p>
                            ) : (
                                <p className="title">
                                    <span role="img" aria-label="box">📦 </span>
                                    Create Reminder
                                </p>
                            )
                        }
                        {reminder && (
                            <button
                                onClick={deleteReminder}
                                className="button button--secondary button-delete"
                                type="button"
                            >
                                {
                                    deleteLoading
                                        ? <LoadingSpinner loaderColor={'blue'} loaderVariant={'button'} />
                                        : 'Delete'
                                }
                            </button>
                        )}
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
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Description</p>
                            <textarea
                                className="form__input-field form__input-area"
                                rows={8}
                                value={formValues.description}
                                onChange={({ target }) => setFormValue(target.value, 'description')}
                                maxLength={1900}
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Start</p>
                            <DatePicker
                                className="form__input-field"
                                selected={formValues.startDate}
                                onChange={(date) => setFormValue(date, 'startDate')}
                                minDate={new Date()}
                                required
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">End</p>
                            <DatePicker
                                className="form__input-field"
                                selected={formValues.endDate}
                                onChange={(date) => setFormValue(date, 'endDate')}
                                minDate={formValues.startDate}
                                required
                            />
                        </div>
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
                            {createLoading || updateLoading
                                ? <LoadingSpinner loaderColor={'white'} loaderVariant={'button'} />
                                : 'Save'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
