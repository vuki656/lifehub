import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { ButtonLoadingIconWhite } from '../../../../components/ButtonLoadingIconWhite'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { CREATE_TASK_CARD, GET_ALL_TASK_CARDS, UPDATE_TASK_CARD } from '../../../../graphql/taskCard/taskCard'
import { createTaskCardResponse, createTaskCardVariables, updateTaskCardResponse, updateTaskCardVariables } from '../../../../graphql/taskCard/taskCard.types'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { TaskCardDialogProps } from './TaskCardDialog.types'

export const TaskCardDialog: React.FC<TaskCardDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, taskCard } = props

    const [createTaskCardMutation, { loading: createLoading }] = useMutation<createTaskCardResponse, createTaskCardVariables>(CREATE_TASK_CARD)
    const [updateTaskCardMutation, { loading: updateLoading }] = useMutation<updateTaskCardResponse, updateTaskCardVariables>(UPDATE_TASK_CARD)

    const { username } = useSelector((state) => state.user)
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const [formValues, setFormValue, clearDialog] = useFormFields({
        name: taskCard ? taskCard.name : '',
    })

    // Cancel task creation, clear form, close dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        clearDialog()
        setErrors({})
    }, [toggleDialog])

    // Save task
    const createTaskCard = useCallback(() => {
        createTaskCardMutation({
            variables: {
                username,
                name: formValues.name,
            },
            update(cache, response) {
                handleDialogToggle()
                const { getAllTaskCards }: any = cache.readQuery({
                    query: GET_ALL_TASK_CARDS,
                    variables: { username },
                })
                const updatedList = _.concat(getAllTaskCards, { ...response.data?.createTaskCard })
                cache.writeQuery({
                    query: GET_ALL_TASK_CARDS,
                    data: { getAllTaskCards: updatedList },
                    variables: { username },
                })
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [createTaskCardMutation, username, formValues.name, handleDialogToggle])

    // Update task card
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
                        {taskCard
                            ? (
                                <p className="title">
                                    <span role="img" aria-label="pencil">✏️ </span>
                                    Update Task Card
                                </p>
                            ) : (
                                <p className="title">
                                    <span role="img" aria-label="box">📦 </span>
                                    Create Task Card
                                </p>
                            )
                        }
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
                            {createLoading || updateLoading ? <ButtonLoadingIconWhite /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
