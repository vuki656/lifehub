import { useMutation } from '@apollo/react-hooks'
import { useFormik } from 'formik'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { Message } from '../../../../components/Message'
import {
    CREATE_CARD,
    EDIT_CARD,
} from '../../../../graphql/mutations/card.mutations'
import {
    CreateCardMutation,
    CreateCardMutationVariables,
    EditCardMutation,
    EditCardMutationVariables,
} from '../../../../graphql/types'
import { UserStateType } from '../../../../redux/reducers/user'

import {
    TaskCardDialogProps,
    TaskCardFormTypes,
} from './TaskCardDialog.types'

export const TaskCardDialog: React.FC<TaskCardDialogProps> = (props) => {
    const {
        isDialogOpen,
        toggleDialog,
        taskCard,
    } = props

    const [createTaskCardMutation, { loading: createLoading }] = useMutation<CreateCardMutation, CreateCardMutationVariables>(CREATE_CARD)
    const [editCardMutation, { loading: editLoading }] = useMutation<EditCardMutation, EditCardMutationVariables>(EDIT_CARD)

    const { user } = useSelector((state: UserStateType) => state)
    const [errors, setErrors] = React.useState<{ error?: string }>({ error: '' })

    const taskCardForm = useFormik<TaskCardFormTypes>({
        initialValues: { name: '' },
        onSubmit: (formValues) => handleSubmit(formValues),
    })

    // Clear errors and toggle dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        taskCardForm.resetForm()
        setErrors({})
    }, [toggleDialog, taskCardForm])

    // Save task card
    const createTaskCard = useCallback((formValues: TaskCardFormTypes) => {
        createTaskCardMutation({ variables: { input: { name: formValues.name } } })
        .then(() => {
            handleDialogToggle()
            taskCardForm.resetForm()
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [user.username, handleDialogToggle, taskCardForm])

    // Update task card
    const editCard = useCallback((formValues: TaskCardFormTypes) => {
        editCardMutation({
            variables: {
                input: {
                    id: taskCard?.id!,
                    name: formValues.name,
                },
            },
        })
        .then(() => toggleDialog())
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [toggleDialog, taskCard])

    // If task exists update, else create
    const handleSubmit = useCallback((formValues: TaskCardFormTypes) => {
        taskCard
            ? editCard(formValues)
            : createTaskCard(formValues)
    }, [createTaskCard, editCard, taskCard])

    return (
        <form autoComplete="off" onSubmit={taskCardForm.handleSubmit}>
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
                    <div className="form__input-wrapper">
                        <div className="form__field-wrapper">
                            <p className="form__field-title">Name</p>
                            <input
                                className="form__input-field"
                                type="text"
                                required
                                name="name"
                                onChange={taskCardForm.handleChange}
                                value={taskCardForm.values.email}
                                maxLength={150}
                            />
                        </div>
                        {errors.error && <Message message={errors.error} type="error" />}
                    </div>
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
                            {createLoading || editLoading ? <LoadingSpinner loaderColor={'white'} loaderVariant={'button'} /> : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
