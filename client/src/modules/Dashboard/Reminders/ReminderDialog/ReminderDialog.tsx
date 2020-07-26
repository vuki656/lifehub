import { useMutation } from '@apollo/react-hooks'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useFormik } from 'formik'
import React from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'

import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { Message } from '../../../../components/Message'
import {
    CREATE_REMINDER,
    DELETE_REMINDER,
    EDIT_REMINDER,
} from '../../../../graphql/mutations/reminder.mutations'
import { REMINDERS_BY_DATE } from '../../../../graphql/queries/reminder.queries'
import {
    CreateReminderMutation,
    CreateReminderMutationVariables,
    DeleteReminderMutation,
    DeleteReminderMutationVariables,
    EditReminderMutation,
    EditReminderMutationVariables,
    RemindersByDateQuery,
    RemindersByDateQueryVariables,
} from '../../../../graphql/types'
import { toCompatibleDate } from '../../../../util/helpers/convertToCompatibleDate'

import type {
    ReminderDialogProps,
    ReminderFormTypes,
} from './ReminderDialog.types'

dayjs.extend(isBetween)

export const ReminderDialog: React.FunctionComponent<ReminderDialogProps> = (props) => {
    const {
        isDialogOpen,
        toggleDialog,
        reminder,
    } = props

    const { selectedDate } = useSelector((state: any) => state.user)

    const [createReminderMutation, { loading: createLoading }] = useMutation<CreateReminderMutation, CreateReminderMutationVariables>(CREATE_REMINDER)
    const [editReminderMutation, { loading: editLoading }] = useMutation<EditReminderMutation, EditReminderMutationVariables>(EDIT_REMINDER)
    const [deleteReminderMutation, { loading: deleteLoading }] = useMutation<DeleteReminderMutation, DeleteReminderMutationVariables>(DELETE_REMINDER)

    // Form
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const reminderForm = useFormik<ReminderFormTypes>({
        initialValues: {
            endDate: reminder
                ? new Date(reminder.endDate)
                : undefined,
            note: reminder?.note
                ? reminder.note
                : '',
            startDate: reminder
                ? new Date(reminder.startDate)
                : new Date(selectedDate),
            title: reminder
                ? reminder.title
                : '',
        },
        onSubmit: (formValues) => handleSubmit(formValues),
    })

    // Clear errors and toggle dialog
    const handleDialogToggle = React.useCallback(() => {
        toggleDialog()
        reminderForm.resetForm()
        setErrors({})
    }, [
        toggleDialog,
        reminderForm,
    ])

    const createReminder = React.useCallback((formValues: ReminderFormTypes) => {
        createReminderMutation({
            update: (proxy, mutationResult) => {
                const createdReminder = mutationResult.data?.createReminder.reminder
                if (
                    !createdReminder ||
                    !dayjs(selectedDate).isBetween(
                        createdReminder.startDate,
                        createdReminder.endDate,
                        'date',
                        '[]', // Indicates inclusion of edge date (start/end)
                    )
                ) {
                    return
                }

                const localCache = proxy.readQuery<RemindersByDateQuery, RemindersByDateQueryVariables>({
                    query: REMINDERS_BY_DATE,
                    variables: { date: selectedDate },
                })

                const updatedList = localCache?.remindersByDate.concat(createdReminder) || []

                proxy.writeQuery<RemindersByDateQuery, RemindersByDateQueryVariables>({
                    data: { remindersByDate: updatedList },
                    query: REMINDERS_BY_DATE,
                    variables: { date: selectedDate },
                })
            },
            variables: {
                input: {
                    endDate: toCompatibleDate(formValues.endDate!),
                    note: formValues.note,
                    startDate: toCompatibleDate(formValues.startDate),
                    title: formValues.title,
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
    }, [
        handleDialogToggle,
        reminderForm,
        selectedDate,
    ])

    const editReminder = React.useCallback(async (formValues: ReminderFormTypes) => {
        await editReminderMutation({
            update: (proxy, mutationResult) => {
                toggleDialog()

                const editedReminder = mutationResult.data?.editReminder.reminder

                if (
                    !editedReminder ||
                    dayjs(selectedDate).isBetween(
                        editedReminder.startDate,
                        editedReminder.endDate,
                        'date',
                        '[]', // Indicates inclusion of edge date (start/end)
                    )
                ) {
                    return
                }

                const localCache = proxy.readQuery<RemindersByDateQuery, RemindersByDateQueryVariables>({
                    query: REMINDERS_BY_DATE,
                    variables: { date: selectedDate },
                })

                const updatedList = localCache?.remindersByDate.filter((reminder) => {
                    return reminder.id !== editedReminder.id
                }) || []

                proxy.writeQuery<RemindersByDateQuery, RemindersByDateQueryVariables>({
                    data: { remindersByDate: updatedList },
                    query: REMINDERS_BY_DATE,
                    variables: { date: selectedDate },
                })
            },
            variables: {
                input: {
                    endDate: toCompatibleDate(formValues.endDate!),
                    id: reminder?.id!,
                    note: formValues.note,
                    startDate: toCompatibleDate(formValues.startDate),
                    title: formValues.title,
                },
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        selectedDate,
        toggleDialog,
        reminder,
    ])

    // If reminder exists edit, else create
    const handleSubmit = React.useCallback((formValues: ReminderFormTypes) => {
        reminder
            ? editReminder(formValues)
            : createReminder(formValues)
    }, [
        reminder,
        createReminder,
        editReminder,
    ])

    // Delete reminder
    const deleteReminder = React.useCallback(() => {
        deleteReminderMutation({
            update: (proxy, mutationResult) => {
                const deletedReminderId = mutationResult.data?.deleteReminder.id
                if (!deletedReminderId) {
                    return
                }

                const localCache = proxy.readQuery<RemindersByDateQuery, RemindersByDateQueryVariables>({
                    query: REMINDERS_BY_DATE,
                    variables: { date: selectedDate },
                })

                const updatedList = localCache?.remindersByDate.filter((reminder) => {
                    return reminder.id !== deletedReminderId
                }) || []

                proxy.writeQuery<RemindersByDateQuery, RemindersByDateQueryVariables>({
                    data: { remindersByDate: updatedList },
                    query: REMINDERS_BY_DATE,
                    variables: { date: selectedDate },
                })
            },
            variables: { id: reminder?.id! },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [
        reminder,
        selectedDate,
        handleDialogToggle,
    ])

    return (
        <form autoComplete="off" onSubmit={reminderForm.handleSubmit}>
            <div className={'dialog ' + (isDialogOpen
                ? 'dialog--open'
                : 'dialog--closed')}>
                <div className="dialog__content">
                    <div className="dialog__header-wrapper">
                        {reminder
                            ? (
                                <p className="title">
                                    <span role="img" aria-label="pencil">✏️ </span>
                                    Update Reminder
                                </p>
                            )
                            : (
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
                            {createLoading || editLoading
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
