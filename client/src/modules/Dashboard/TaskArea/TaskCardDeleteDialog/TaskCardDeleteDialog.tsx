import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { Message } from '../../../../components/Message'
import { DELETE_CARD } from '../../../../graphql/mutations/card.mutations'
import {
    DeleteCardMutation,
    DeleteCardMutationVariables,
} from '../../../../graphql/types'
import { UserStateType } from '../../../../redux/reducers/user'

import { TaskCardDeleteDialogProps } from './TaskCardDeleteDialog.types'

export const TaskCardDeleteDialog: React.FC<TaskCardDeleteDialogProps> = (props) => {
    const {
        isDialogOpen,
        toggleDialog,
        taskCard,
    } = props

    const { user } = useSelector((state: UserStateType) => state)
    const [errors, setErrors] = React.useState<{ error?: string }>({ error: '' })
    const [deleteCardMutation, { loading: deleteLoading }] = useMutation<DeleteCardMutation, DeleteCardMutationVariables>(DELETE_CARD)

    // Cancel task creation, clear form, close dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        setErrors({})
    }, [toggleDialog])

    // Delete reminder
    const deleteTaskCard = useCallback(() => {
        deleteCardMutation({ variables: { input: { id: taskCard?.id! } } })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [handleDialogToggle, taskCard, user.username])

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
                {errors.error && <Message message={errors.error} type="error" />}
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
                        {deleteLoading
                            ? <LoadingSpinner loaderColor={'white'} loaderVariant={'button'} />
                            : 'Yes'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}
