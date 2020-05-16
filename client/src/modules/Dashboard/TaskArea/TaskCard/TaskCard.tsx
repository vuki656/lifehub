import { useMutation } from '@apollo/react-hooks'
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { CREATE_TASK } from '../../../../graphql/task/task'
import { createTaskResponse, createTaskVariables } from '../../../../graphql/task/task.types'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { TaskCardDeleteDialog } from '../TaskCardDeleteDialog'
import { TaskCardDialog } from '../TaskCardDialog'
import { TaskCardProps } from './TaskCard.types'

export const TaskCard: React.FC<TaskCardProps> = (props) => {
    const { taskCard } = props

    const [isEditDialogOpen, toggleEditDialog] = useToggle(false)
    const [isDeleteDialogOpen, toggleDeleteDialog] = useToggle(false)
    const [errors, setErrors] = React.useState<{ error?: string }>()
    const { username, selectedDate } = useSelector((state) => state.user)

    // TODO: handle fetch error
    const [createTaskMutation, { loading: createLoading }] = useMutation<createTaskResponse, createTaskVariables>(CREATE_TASK)
    // const { data, loading: fetchLoading } = useQuery<getTasksByDateAndTaskCardResponse, getTasksByDateAndTaskCardVariables>(GET_TASKS_BY_DATE_AND_TASK_CARD, {
    //     variables: {
    //         taskCardId: taskCard.id,
    //         selectedDate,
    //     },
    // })

    // Form
    const { formValues, setFormValue, clearForm } = useFormFields({
        title: '',
    })

    // Save task
    const createTask = useCallback(() => {
        console.log(formValues)
        console.log(taskCard)
        console.log(selectedDate)
        createTaskMutation({
            variables: {
                input: {
                    title: formValues.title,
                    taskCardId: taskCard.id,
                    taskMetaData: {
                        date: selectedDate,
                    },
                },
            },
        })
        .then((res) => {
            console.log(res)
            clearForm()
        })
        .catch((error) => {
            console.log(error)
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [username, clearForm, createTaskMutation, selectedDate, taskCard.id, formValues.title])

    // Handle form submit
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        createTask()
    }, [createTask])

    return (
        <>
            {/*{fetchLoading*/}
            {/*    ? (renderLoaders(1, <TaskCardLoader />))*/}
            {/*    : (*/}
            <div className="task-card">
                <div className="task-card__header">
                    <p className="task-card__name">{taskCard.name}</p>
                    <div>
                        <DeleteOutlineRoundedIcon
                            className="task-card__icon"
                            onClick={toggleDeleteDialog}
                        />
                        <EditRoundedIcon
                            className="task-card__icon"
                            onClick={toggleEditDialog}
                        />
                    </div>
                </div>
                {/*<div className="task-card__body">*/}
                {/*    {data && data.getTasksByDateAndTaskCard.map(task => (*/}
                {/*        <Task task={task} taskCard={taskCard} key={task.id} />*/}
                {/*    ))}*/}
                {/*</div>*/}
                <div className="task-card__input">
                    <form onSubmit={handleSubmit}>
                        {createLoading ? <ButtonLoadingIconBlue size={35} /> : (
                            <input
                                className="form__input-field task-card__input-field"
                                type="text"
                                required
                                value={formValues.title}
                                placeholder="Click to quickly add a task"
                                onChange={({ target }) => setFormValue(target.value, 'title')}
                                maxLength={150}
                            />
                        )}
                    </form>
                </div>
                {errors?.error && <ErrorMessage error={errors.error} />}
                <TaskCardDialog
                    isDialogOpen={isEditDialogOpen}
                    toggleDialog={toggleEditDialog}
                    taskCard={taskCard}
                />
                <TaskCardDeleteDialog
                    isDialogOpen={isDeleteDialogOpen}
                    toggleDialog={toggleDeleteDialog}
                    taskCard={taskCard}
                />
            </div>
        </>
    )
}
