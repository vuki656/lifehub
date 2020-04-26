import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'
import { FormErrorMessage } from '../../../components/FormErrorMessage'

import { CREATE_REMINDER } from '../../../graphql/reminder/reminder'
import { createReminderResponse, createReminderVariables } from '../../../graphql/reminder/reminder.types'
import { ReminderErrors } from './Reminder.types'

export const Reminders: React.FC<{}> = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)
    const username = useSelector((state) => state.user.username)
    const [errors, setErrors] = React.useState<ReminderErrors>({})
    const [createUserMutation] = useMutation<createReminderResponse, createReminderVariables>(CREATE_REMINDER)

    // Save reminder
    const onSubmit = useCallback((formValues) => {
        createUserMutation({
            variables: {
                username,
                title: formValues.title,
                description: formValues.description,
            },
        })
        .then(() => {
            toggleDialog()
            form.reset()
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [createUserMutation, username, toggleDialog])

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
        <div className="reminders">
            <p className="title">Reminders</p>
            <button onClick={toggleDialog}>Create Reminder</button>
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
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
