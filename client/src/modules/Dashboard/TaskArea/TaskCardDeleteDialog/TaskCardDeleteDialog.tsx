import { useMutation } from '@apollo/react-hooks'
import _ from 'lodash'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { DELETE_TASK_CARD, GET_ALL_TASK_CARDS } from '../../../../graphql/taskCard/taskCard'
import { deleteTaskCardResponse, deleteTaskCardVariables } from '../../../../graphql/taskCard/taskCard.types'
import { TaskCardDeleteDialogProps } from './TaskCardDeleteDialog.types'

export const TaskCardDeleteDialog: React.FC<TaskCardDeleteDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, taskCard } = props

    const { username } = useSelector((state) => state.user)
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const [deleteTaskCardMutation, { loading: deleteLoading }] = useMutation<deleteTaskCardResponse, deleteTaskCardVariables>(DELETE_TASK_CARD)

    // Cancel task creation, clear form, close dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        setErrors({})
    }, [toggleDialog])

    // Delete reminder
    const deleteTaskCard = useCallback(() => {
        deleteTaskCardMutation({
            variables: {
                id: taskCard?.id!,
            },
            update(cache, { data }) {
                handleDialogToggle()
                const { getAllTaskCards }: any = cache.readQuery({
                    query: GET_ALL_TASK_CARDS,
                    variables: { username },
                })
                const updatedList = _.filter(getAllTaskCards, ({ id }) => (
                    id !== data?.deleteTaskCard.id
                ))
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
    }, [deleteTaskCardMutation, handleDialogToggle, taskCard, username])

    return (
        <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
            <div className="dialog__content">
                <div className="dialog__header-wrapper">
                    <p className="title">
                        <span role="img" aria-label="trash">🗑</span>️
                        Delete Task Card
                    </p>
                </div>
                <div className="dialog__text">
                    <p>Are you sure you want to delete <strong>{taskCard?.name}</strong>?</p>
                </div>
                {errors.error && <ErrorMessage error={errors.error} />}
                <div className="form__button-group--right">
                    <button
                        onClick={toggleDialog}
                        className="button button--secondary button-delete"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={deleteTaskCard}
                        className="button button--primary button-delete"
                        type="button"
                    >
                        {deleteLoading ? <ButtonLoadingIconBlue size={18}/> : 'Yes'}
                    </button>
                </div>
            </div>
        </div>
    )
}
