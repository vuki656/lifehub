import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'
import React, { useCallback, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ButtonLoadingIconWhite } from '../../../../components/ButtonLoadingIconWhite'
import { ErrorMessage } from '../../../../components/ErrorMessage'
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
    updateReminderResponse,
    updateReminderVariables,
} from '../../../../graphql/reminder/reminder.types'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { ReminderErrors } from '../Reminder.types'
import { ReminderDialogProps } from './ReminderDialog.types'

export const ReminderDialog: React.FC<ReminderDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, reminder } = props

    const { username, selectedDate } = useSelector((state) => state.user)
    const [createReminderMutation, { loading: createLoading }] = useMutation<createReminderResponse, createReminderVariables>(CREATE_REMINDER)
    const [updateReminderMutation, { loading: updateLoading }] = useMutation<updateReminderResponse, updateReminderVariables>(UPDATE_REMINDER)
    const [deleteReminderMutation, { loading: deleteLoading }] = useMutation<deleteReminderResponse, deleteReminderVariables>(DELETE_REMINDER)

    // Form
    const [errors, setErrors] = React.useState<ReminderErrors>({})
    const [startDate, setStartDate] = useState<Date | undefined>(reminder ? new Date(reminder.startDate) : undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(reminder ? new Date(reminder.endDate) : undefined)
    const [{ title, description }, setFormValue] = useFormFields({
        title: reminder ? reminder.title : '',
        description: reminder?.description ? reminder.description : '',
    })

    // Cancel reminder creation, clear form, close dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        setErrors({})
    }, [toggleDialog])

    // Save reminder
    const createReminder = useCallback(() => {
        createReminderMutation({
            variables: {
                username,
                title,
                description,
                startDate: startDate!,
                endDate: endDate!,
            },
            update(cache, response) {
                handleDialogToggle()
                const { getRemindersByDate }: any = cache.readQuery({
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        username,
                        selectedDate,
                    },
                })
                const updatedList = _.concat(getRemindersByDate, { ...response.data?.createReminder })
                cache.writeQuery({
                    query: GET_REMINDERS_BY_DATE,
                    data: { getRemindersByDate: updatedList },
                    variables: {
                        username,
                        selectedDate,
                    },
                })
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [createReminderMutation, username, endDate, startDate, title, description, handleDialogToggle, selectedDate])

    // Update reminder
    const updateReminder = useCallback(() => {
        updateReminderMutation({
            variables: {
                id: reminder?.id!,
                username,
                title,
                description,
                startDate: startDate!,
                endDate: endDate!,
            },
        })
        .then(() => handleDialogToggle())
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [updateReminderMutation, username, endDate, startDate, title, description, handleDialogToggle, reminder])

    // If reminder exists update, else create
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        reminder ? updateReminder() : createReminder()
    }, [reminder, createReminder, updateReminder])

    // Delete reminder
    const deleteReminder = useCallback(() => {
        deleteReminderMutation({
            variables: {
                id: reminder?.id!,
            },
            update(cache, response) {
                handleDialogToggle()
                const { getRemindersByDate }: any = cache.readQuery({
                    query: GET_REMINDERS_BY_DATE,
                    variables: {
                        username,
                        selectedDate,
                    },
                })
                const updatedList = _.filter(getRemindersByDate, ({ id }) =>
                    id !== response?.data?.deleteReminder.id,
                )
                cache.writeQuery({
                    query: GET_REMINDERS_BY_DATE,
                    data: { getRemindersByDate: updatedList },
                    variables: {
                        username,
                        selectedDate,
                    },
                })
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [deleteReminderMutation, handleDialogToggle, reminder, selectedDate, username])

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                <div className="dialog__content">
                    <div className="dialog__header-wrapper">
                        <p className="title">{reminder ? '✏️ Update' : '📦 Create'} Reminder</p>
                        {reminder && (
                            <button
                                onClick={deleteReminder}
                                className="button button--secondary button-delete"
                                type="button"
                            >
                                {deleteLoading ? <ButtonLoadingIconBlue /> : 'Delete'}
                            </button>
                        )}
                    </div>
                    <div className="form_input-wrapper">
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Title</p>
                            <input
                                className="form__input-field"
                                type="text"
                                required
                                name="title"
                                value={title}
                                onChange={setFormValue}
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Description</p>
                            <textarea
                                className="form__input-field form__input-area"
                                name="description"
                                rows={8}
                                value={description}
                                onChange={setFormValue}
                                maxLength={1900}
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Start</p>
                            <DatePicker
                                className="form__input-field"
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                minDate={new Date()}
                                required
                            />
                        </div>
                        <div className="form__field-wrapper">
                            <p className="form__field-title">End</p>
                            <DatePicker
                                className="form__input-field"
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                minDate={startDate}
                                required
                            />
                        </div>
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
                            {createLoading || updateLoading ? <ButtonLoadingIconWhite /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )

}
