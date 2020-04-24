import React, { useCallback } from 'react'
import { useField, useForm } from 'react-final-form-hooks'
import { useToggle } from 'react-use'

export const Reminders: React.FC<{}> = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)

    // Log user in
    const onSubmit = useCallback(() => {
        // console.log('saved reminder')
        // console.log(formValues)
    }, [])

    const { form, handleSubmit } = useForm({ onSubmit })

    const title = useField('title', form)
    const description = useField('description', form)

    const handleCancelSubmit = useCallback(() => {
        form.reset()
        toggleDialog()
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
                                required
                                {...description.input}
                            />
                        </div>
                        <div className="form__button-group--right">
                            <button
                                onClick={handleCancelSubmit}
                                className="form__button button button--secondary"
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={toggleDialog}
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
