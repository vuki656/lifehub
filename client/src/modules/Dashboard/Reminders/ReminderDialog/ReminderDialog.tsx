import { useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'

import { ButtonLoading } from '../../../../components/ButtonLoading'
import { FormErrorMessage } from '../../../../components/FormErrorMessage'
import { CREATE_REMINDER, UPDATE_REMINDER } from '../../../../graphql/reminder/reminder'
import {
    createReminderResponse,
    createReminderVariables,
    updateReminderResponse,
    updateReminderVariables,
} from '../../../../graphql/reminder/reminder.types'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { ReminderErrors } from '../Reminder.types'
import { ReminderDialogProps } from './ReminderDialog.types'

export const ReminderDialog: React.FC<ReminderDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, reminder } = props

    const [createReminderMutation, { loading: createLoading }]
        = useMutation<createReminderResponse, createReminderVariables>(CREATE_REMINDER)
    const [updateReminderMutation, { loading: updateLoading }]
        = useMutation<updateReminderResponse, updateReminderVariables>(UPDATE_REMINDER)
    const username = useSelector((state) => state.user.username)

    // Form
    const [errors, setErrors] = React.useState<ReminderErrors>({})
    const [startDate, setStartDate] = useState<Date | undefined>(reminder ? new Date(reminder.startDate / 1) : undefined) // No idea why 1 is needed, crashes with it
    const [endDate, setEndDate] = useState<Date | undefined>(reminder ? new Date(reminder.endDate / 1) : undefined)
    const [{ title, description }, setFormValue, clearForm] = useFormFields({
        title: reminder ? reminder.title : '',
        description: reminder?.description ? reminder.description : '',
    })

    // Clear input fields and date selectors
    const resetForm = useCallback(() => {
        clearForm()
        setStartDate(undefined)
        setEndDate(undefined)
    }, [clearForm])

    // Cancel reminder creation, clear form, close dialog
    const handleCancelSubmit = useCallback(() => {
        toggleDialog()
        setErrors({})
        resetForm()
    }, [toggleDialog, resetForm])

    // Save reminder
    const saveReminder = useCallback(() => {
        createReminderMutation({
            variables: {
                username,
                title,
                description,
                startDate: moment.utc(startDate).format()!,
                endDate: moment.utc(endDate).format()!,
            },
        })
        .then(() => handleCancelSubmit())
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [createReminderMutation, username, endDate, startDate, title, description, handleCancelSubmit])

    // Update reminder
    const updateReminder = useCallback(() => {
        updateReminderMutation({
            variables: {
                id: reminder?.id!,
                username,
                title,
                description,
                startDate: moment.utc(startDate).format()!,
                endDate: moment.utc(endDate).format()!,
            },
        })
        .then(() => handleCancelSubmit())
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [updateReminderMutation, username, endDate, startDate, title, description, handleCancelSubmit, reminder])

    // If reminder exists update, else create
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        reminder ? updateReminder() : saveReminder()
    }, [reminder, saveReminder, updateReminder])

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                <div className="dialog__content">
                    <p className="title">Create a Reminder</p>
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
                    {errors.error && <FormErrorMessage error={errors.error} />}
                    <div className="form__button-group--right">
                        <button
                            onClick={handleCancelSubmit}
                            className="form__button button button--secondary"
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="form__button button button--primary"
                        >
                            {createLoading || updateLoading ? <ButtonLoading /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )

}
