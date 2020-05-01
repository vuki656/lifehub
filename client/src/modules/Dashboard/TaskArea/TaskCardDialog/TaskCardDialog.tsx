import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ButtonLoadingIconWhite } from '../../../../components/ButtonLoadingIconWhite'

import { ErrorMessage } from '../../../../components/ErrorMessage'
import { CREATE_TASK_CARD, UPDATE_TASK_CARD } from '../../../../graphql/taskCard/taskCard'
import { createTaskCardResponse, createTaskCardVariables, updateTaskCardResponse, updateTaskCardVariables } from '../../../../graphql/taskCard/taskCard.types'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { ReminderErrors } from '../../Reminders/Reminder.types'
import { TaskCardDialogProps } from './TaskCardDialog.types'

export const TaskCardDialog: React.FC<TaskCardDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, taskCard } = props

    const [createTaskCardMutation, { loading: createLoading }] = useMutation<createTaskCardResponse, createTaskCardVariables>(CREATE_TASK_CARD)
    const [updateTaskCardMutation, { loading: updateLoading }] = useMutation<updateTaskCardResponse, updateTaskCardVariables>(UPDATE_TASK_CARD)

    const { username } = useSelector((state) => state.user)
    const [errors, setErrors] = React.useState<ReminderErrors>({})
    const [formValues, setFormValue] = useFormFields({
        name: taskCard ? taskCard.name : '',
        name1: '',
    })

    // Cancel task creation, clear form, close dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        setErrors({})
    }, [toggleDialog])

    // Save task
    const createTaskCard = useCallback(() => {
        createTaskCardMutation({
            variables: {
                username,
                name: formValues.name,
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [createTaskCardMutation, username, formValues.name])

    const updateTaskCard = useCallback(() => {
        updateTaskCardMutation({
            variables: {
                id: taskCard?.id!,
                name: formValues.name,
            },
        })
        .then(() => handleDialogToggle())
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [formValues, handleDialogToggle, taskCard, updateTaskCardMutation])

    // If task exists update, else create
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        taskCard ? updateTaskCard() : createTaskCard()
    }, [createTaskCard, updateTaskCard, taskCard])

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                <div className="dialog__content">
                    <div className="dialog__header-wrapper">
                        <p className="title">{taskCard ? '✏️ Update' : '📦 Create'} Task Card</p>
                        {/*{task && (*/}
                        {/*    <button*/}
                        {/*        onClick={deleteTask}*/}
                        {/*        className="button button--secondary button-delete"*/}
                        {/*        type="button"*/}
                        {/*    >*/}
                        {/*        {deleteLoading ? <ButtonLoadingIconBlue /> : 'Delete'}*/}
                        {/*    </button>*/}
                        {/*)}*/}
                    </div>
                    <div className="form_input-wrapper">
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Name</p>
                            <input
                                className="form__input-field"
                                type="text"
                                required
                                name="name"
                                value={formValues.name}
                                onChange={setFormValue}
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
                            {/*{createLoading || updateLoading ? <ButtonLoadingIconWhite /> : 'Save'}*/}
                            {createLoading ? <ButtonLoadingIconWhite /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
