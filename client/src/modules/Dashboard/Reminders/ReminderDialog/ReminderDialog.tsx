import { useMutation } from '@apollo/react-hooks'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useFormik } from 'formik'
import _ from 'lodash'
import React, { useCallback } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'

import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { Message } from '../../../../components/Message'
import {
    CREATE_REMINDER,
    DELETE_REMINDER,
    UPDATE_REMINDER,
} from '../../../../graphql/reminder/mutations'
import { GET_REMINDERS_BY_DATE } from '../../../../graphql/reminder/queries'
import {
    DeleteReminderVariables,
    GetRemindersByDateResponse,
    UpdateReminderVariables,
} from '../../../../graphql/reminder/reminder.types'
import { CreateReminderResponse } from '../../../../graphql/reminder/types/payloads'
import { CreateReminderVariables } from '../../../../graphql/reminder/types/variables'
import { UserStateType } from '../../../../redux/reducers/user'
import { toCompatibleDate } from '../../../../util/helpers/convertToCompatibleDate'
import { sortRemindersByDate } from '../../../../util/helpers/sortRemindersByDate'

import type {
    ReminderDialogProps,
    ReminderFormTypes,
} from './ReminderDialog.types'

dayjs.extend(isBetween)

export const ReminderDialog: React.FC<ReminderDialogProps> = (props) => {
    const {
        isDialogOpen,
        toggleDialog,
        reminder,
    } = props

    const {
        user,
        selectedDate,
    } = useSelector((state: UserStateType) => state)

    const [createReminderMutation, { loading: createLoading }] = useMutation<CreateReminderResponse, CreateReminderVariables>(CREATE_REMINDER)
    // eslint-disable-next-line @typescript-eslint/ban-types
    const [updateReminderMutation, { loading: updateLoading }] = useMutation<any, UpdateReminderVariables>(UPDATE_REMINDER)
    // eslint-disable-next-line @typescript-eslint/ban-types
    const [deleteReminderMutation, { loading: deleteLoading }] = useMutation<any, DeleteReminderVariables>(DELETE_REMINDER)

    // Form
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const reminderForm = useFormik<ReminderFormTypes>({
        initialValues: {
            description: reminder?.description ? reminder.description : '',
            endDate: reminder ? new Date(reminder.endDate) : undefined,
            startDate: reminder ? new Date(reminder.startDate) : new Date(selectedDate),
            title: reminder ? reminder.title : '',
        },
        onSubmit: (formValues) => handleSubmit(formValues),
    })

    // Clear errors and toggle dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        reminderForm.resetForm()
        setErrors({})
    }, [toggleDialog, reminderForm])

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
    const createReminder = useCallback((formValues: ReminderFormTypes) => {
        createReminderMutation({
            // update(cache, response) {
            //     // If selected day in between reminder date range, display it in view
            //     if (
            //         dayjs(selectedDate).isBetween(
            //             response.data?.createReminder.startDate!,
            //             response.data?.createReminder.endDate!,
            //             'date',
            //             '[]', // Indicates inclusion of edge date (start/end)
            //         )
            //     ) {
            //         const localCache = cache.readQuery<GetRemindersByDateResponse>({
            //             query: GET_REMINDERS_BY_DATE,
            //             variables: {
            //                 selectedDate,
            //                 username: user.username,
            //             },
            //         })
            //         const updatedList = _.concat(localCache?.getRemindersByDate, { ...response.data?.createReminder }) || []
            //         cache.writeQuery<GetRemindersByDateResponse>({
            //             data: { getRemindersByDate: sortRemindersByDate(updatedList) },
            //             query: GET_REMINDERS_BY_DATE,
            //             variables: {
            //                 selectedDate,
            //                 username: user.username,
            //             },
            //         })
            //     }
            // },
            variables: {
                input: {
                    description: formValues.description,
                    endDate: toCompatibleDate(formValues.endDate!),
                    startDate: toCompatibleDate(formValues.startDate),
                    title: formValues.title,
                    username: user.username,
                },
            },
        })
        .then(() => {
            handleDialogToggle()
            reminderForm.resetForm()
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [handleDialogToggle, createReminderMutation, user.username, reminderForm, selectedDate])

    // Update reminder
    const updateReminder = useCallback((formValues: ReminderFormTypes) => {
        updateReminderMutation({
            update(cache, response) {
                toggleDialog()
                const localCache = cache.readQuery<GetRemindersByDateResponse>({
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        selectedDate,
                        username: user.username,
                    },
                })
                const updatedList = removeFromTodayIfOutOfRange(response.data?.updateReminder, localCache?.getRemindersByDate)
                cache.writeQuery<GetRemindersByDateResponse>({
                    data: { getRemindersByDate: sortRemindersByDate(updatedList) },
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        selectedDate,
                        username: user.username,
                    },
                })
            },
            variables: {
                description: formValues.description,
                endDate: toCompatibleDate(formValues.endDate!),
                id: reminder?.id!,
                startDate: toCompatibleDate(formValues.startDate),
                title: formValues.title,
                username: user.username,
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [removeFromTodayIfOutOfRange, updateReminderMutation, selectedDate, toggleDialog, reminder, user.username])

    // If reminder exists update, else create
    const handleSubmit = useCallback((formValues: ReminderFormTypes) => {
        reminder
            ? updateReminder(formValues)
            : createReminder(formValues)
    }, [reminder, createReminder, updateReminder])

    // Delete reminder
    const deleteReminder = useCallback(() => {
        deleteReminderMutation({
            update(cache, response) {
                handleDialogToggle() // Has to be here to prevent call to unmounted (deleted) component
                const localCache = cache.readQuery<GetRemindersByDateResponse>({
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        selectedDate,
                        username: user.username,
                    },
                })
                const updatedList = _.filter(localCache?.getRemindersByDate, ({ id }) => (
                    id !== response.data?.deleteReminder.id
                ))
                cache.writeQuery<GetRemindersByDateResponse>({
                    data: { getRemindersByDate: sortRemindersByDate(updatedList) },
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        selectedDate,
                        username: user.username,
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
        user.username,
        handleDialogToggle,
    ])

    return (
        <form autoComplete="off" onSubmit={reminderForm.handleSubmit}>
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
                                name="title"
                                onChange={reminderForm.handleChange}
                                value={reminderForm.values.title}
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Description</p>
                            <textarea
                                className="form__input-field form__input-area"
                                rows={8}
                                name="description"
                                onChange={reminderForm.handleChange}
                                value={reminderForm.values.description}
                                maxLength={1900}
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Start</p>
                            <DatePicker
                                className="form__input-field"
                                name="startDate"
                                onChange={(event) => reminderForm.setFieldValue('startDate', event)}
                                selected={reminderForm.values.startDate}
                                minDate={new Date()}
                                required
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">End</p>
                            <DatePicker
                                className="form__input-field"
                                name="endDate"
                                onChange={(event) => reminderForm.setFieldValue('endDate', event)}
                                selected={reminderForm.values.endDate}
                                minDate={reminderForm.values.startDate}
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
