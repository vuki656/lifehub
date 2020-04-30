import React from 'react'
import { TaskDialogProps } from './TaskDialog.types'

export const TaskDialog: React.FC<TaskDialogProps> = (props) => {
    // const { isDialogOpen, toggleDialog, task } = props
    //
    // const [errors, setErrors] = React.useState<ReminderErrors>({})
    // const [{ title }, setFormValue] = useFormFields({
    //     title: task ? task.title : '',
    // })
    //
    // // Cancel task creation, clear form, close dialog
    // const handleDialogToggle = useCallback(() => {
    //     toggleDialog()
    //     setErrors({})
    // }, [toggleDialog])
    //
    // // Save task
    // const createReminder = useCallback(() => {
    //     createTaskMutation({
    //         variables: {
    //             username,
    //             title,
    //         },
    //     })
    //     .catch((error) => {
    //         setErrors(error.graphQLErrors?.[0].extensions.exception)
    //     })
    // }, [createReminderMutation, username, title, handleDialogToggle])
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
    //
    // // If task exists update, else create
    // const handleSubmit = useCallback((event) => {
    //     event.preventDefault()
    //     task ? updateReminder() : createReminder()
    // }, [task, createReminder, updateReminder])
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
    //
    // return (
    //     <form autoComplete="off" onSubmit={handleSubmit}>
    //         <div className={'dialog ' + (isDialogOpen ? 'dialog--open' : 'dialog--closed')}>
    //             <div className="dialog__content">
    //                 <div className="dialog__header-wrapper">
    //                     <p className="title">{task ? '✏️ Update' : '📦 Create'} Task</p>
    //                     {task && (
    //                         <button
    //                             onClick={deleteTask}
    //                             className="button button--secondary button-delete"
    //                             type="button"
    //                         >
    //                             {deleteLoading ? <ButtonLoadingIconBlue /> : 'Delete'}
    //                         </button>
    //                     )}
    //                 </div>
    //                 <div className="form_input-wrapper">
    //                     <div className="form__field-wrapper">
    //                         <p className="form__field-title">Title</p>
    //                         <input
    //                             className="form__input-field"
    //                             type="text"
    //                             required
    //                             name="title"
    //                             value={title}
    //                             onChange={setFormValue}
    //                         />
    //                     </div>
    //                 </div>
    //                 {errors.error && <ErrorMessage error={errors.error} />}
    //                 <div className="form__button-group--right">
    //                     <button
    //                         onClick={handleDialogToggle}
    //                         className="form__button button button--secondary"
    //                         type="button"
    //                     >
    //                         Cancel
    //                     </button>
    //                     <button
    //                         type="submit"
    //                         className="form__button button button--primary"
    //                     >
    //                         {createLoading || updateLoading ? <ButtonLoadingIconWhite /> : 'Save'}
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     </form>
    // )


    return (
        <p>asd</p>
    )
}
