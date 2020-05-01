import { useMutation } from '@apollo/react-hooks'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ButtonLoadingIconWhite } from '../../../../components/ButtonLoadingIconWhite'

import { ErrorMessage } from '../../../../components/ErrorMessage'
import { CREATE_TASK } from '../../../../graphql/task/task'
import { createTaskResponse, createTaskVariables } from '../../../../graphql/task/task.types'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { TaskDialogProps } from './TaskDialog.types'

export const TaskDialog: React.FC<TaskDialogProps> = (props) => {
    const { isDialogOpen, toggleDialog, task } = props

    const [createTaskMutation, { loading: createLoading }] = useMutation<createTaskResponse, createTaskVariables>(CREATE_TASK)

    const { username } = useSelector((state) => state.user)
    const [errors, setErrors] = React.useState<{ error?: string }>({})
    const [formValues, setFormValue] = useFormFields({
        title: task ? task.title : '',
    })

    // todo Add status and date to todo

    // Cancel task creation, clear form, close dialog
    const handleDialogToggle = useCallback(() => {
        toggleDialog()
        setErrors({})
    }, [toggleDialog])

    // Save task
    const createTask = useCallback(() => {
        createTaskMutation({
            variables: {
                username,
                title: formValues.title,
            },
        })
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [createTaskMutation, username, formValues.title, handleDialogToggle])
    //
    // // Update task
    // const updateReminder = useCallback(() => {
    //     updateReminderMutation({
    //         variables: {
    //             id: task?.id!,
    //             title,
    //         },
    //     })
    //     .then(() => handleDialogToggle())
    //     .catch((error) => {
    //         setErrors(error.graphQLErrors?.[0].extensions.exception)
    //     })
    // }, [updateTaskMutation, title, handleDialogToggle, task])

    // If task exists update, else create
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        createTask()
        // task ? updateReminder() : createReminder()
    }, [task, createTask])
    //
    // // Delete task
    // const deleteReminder = useCallback(() => {
    //     deleteReminderMutation({
    //         variables: {
    //             id: task?.id!,
    //         },
    //     })
    //     .catch((error) => {
    //         setErrors(error.graphQLErrors?.[0].extensions.exception)
    //     })
    // }, [deleteTaskMutation, handleDialogToggle, task])

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
                <div className="dialog__content">
                    <div className="dialog__header-wrapper">
                        <p className="title">{task ? '✏️ Update' : '📦 Create'} Task</p>
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
                            <p className="form__field-title">Title</p>
                            <input
                                className="form__input-field"
                                type="text"
                                required
                                name="title"
                                value={formValues.title}
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
