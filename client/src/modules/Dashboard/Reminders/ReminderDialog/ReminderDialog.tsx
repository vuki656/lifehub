import { useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useField, useForm } from 'react-final-form-hooks'
import { useSelector } from 'react-redux'

import { ButtonLoading } from '../../../../components/ButtonLoading'
import { FormErrorMessage } from '../../../../components/FormErrorMessage'
import { CREATE_REMINDER } from '../../../../graphql/reminder/reminder'
import { createReminderResponse, createReminderVariables } from '../../../../graphql/reminder/reminder.types'
import { ReminderErrors } from '../Reminder.types'
import { ReminderDialogProps } from './ReminderDialog.types'

export const ReminderDialog: React.FC<ReminderDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog } = props

    const [createReminderMutation, { loading }] = useMutation<createReminderResponse, createReminderVariables>(CREATE_REMINDER)
    const [errors, setErrors] = React.useState<ReminderErrors>({})
    const username = useSelector((state) => state.user.username)

    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()

    // Save reminder
    const onSubmit = useCallback((formValues) => {
        createReminderMutation({
            variables: {
                username,
                title: formValues.title,
                description: formValues.description,
                start: moment(startDate).format()!,
                end: moment(endDate).format()!,
            },
        })
        .then(() => {
            toggleDialog()
            form.reset()
            setErrors({})
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [createReminderMutation, username, toggleDialog, endDate, startDate])

    const { form, handleSubmit } = useForm({ onSubmit })

    const title = useField('title', form)
    const description = useField('description', form)

    // Cancel reminder creation, clear form, close dialog
    const handleCancelSubmit = useCallback(() => {
        toggleDialog()
        setErrors({})
        form.reset()
    }, [form, toggleDialog])

    return (
        <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
            <div className="dialog__content">
                <form onSubmit={handleSubmit}>
                    <p className="title">Create a Reminder</p>
                    <div className="form__field-wrapper">
                        <p className="form__field-title">Title</p>
                        <input
                            className="form__input-field"
                            type="text"
                            required
                            {...title.input}
                        />
                    </div>
                    <div className="form__field-wrapper">
                        <p className="form__field-title">Description</p>
                        <input
                            className="form__input-field"
                            type="text"
                            {...description.input}
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
                            {loading ? <ButtonLoading isLoadingActive={loading} /> : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
