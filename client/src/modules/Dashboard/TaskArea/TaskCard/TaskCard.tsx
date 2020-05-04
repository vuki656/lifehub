import { useMutation, useQuery } from '@apollo/react-hooks'
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import _ from 'lodash'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { ButtonLoadingIconBlue } from '../../../../components/ButtonLoadingIconBlue'
import { ErrorMessage } from '../../../../components/ErrorMessage'
import { CREATE_TASK, GET_TASKS_BY_DATE_AND_TASK_CARD } from '../../../../graphql/task/task'
import { createTaskResponse, createTaskVariables, getTasksByDateAndTaskCardResponse, getTasksByDateAndTaskCardVariables } from '../../../../graphql/task/task.types'
import { renderLoaders } from '../../../../util/helpers/renderLoaders'
import { useFormFields } from '../../../../util/hooks/useFormFields.hook'
import { Task } from '../Task'
import { TaskCardDeleteDialog } from '../TaskCardDeleteDialog'
import { TaskCardDialog } from '../TaskCardDialog'
import { TaskCardLoader } from '../TaskCardLoader'
import { TaskCardProps } from './TaskCard.types'

export const TaskCard: React.FC<TaskCardProps> = (props) => {
    const { taskCard } = props

    const [isEditDialogOpen, toggleEditDialog] = useToggle(false)
    const [isDeleteDialogOpen, toggleDeleteDialog] = useToggle(false)
    const [errors, setErrors] = React.useState<{ error?: string }>()
    const { username, selectedDate } = useSelector((state) => state.user)

    const [createTaskMutation, { loading: createLoading }] = useMutation<createTaskResponse, createTaskVariables>(CREATE_TASK)
    const { error: fetchError, data, loading: fetchLoading } = useQuery<getTasksByDateAndTaskCardResponse, getTasksByDateAndTaskCardVariables>(GET_TASKS_BY_DATE_AND_TASK_CARD, {
        variables: {
            taskCardId: taskCard.id,
            selectedDate,
        },
    })

    if (fetchError) setErrors(fetchError.graphQLErrors?.[0].extensions.exception)

    // Form
    const { formValues, setFormValue, clearForm } = useFormFields({
        title: '',
        note: '',
    })

    // Save task
    const createTask = useCallback(() => {
        createTaskMutation({
            variables: {
                username,
                title: formValues.title,
                note: formValues.note,
                checked: false,
                date: selectedDate,
                isRepeating: false,
                taskCardId: taskCard.id,
            },
            update(cache, response) {
                const { getTasksByDateAndTaskCard }: any = cache.readQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    variables: {
                        taskCardId: taskCard.id,
                        selectedDate,
                    },
                })
                const updatedList = _.concat(getTasksByDateAndTaskCard, { ...response.data?.createTask })
                cache.writeQuery({
                    query: GET_TASKS_BY_DATE_AND_TASK_CARD,
                    data: { getTasksByDateAndTaskCard: updatedList },
                    variables: {
                        taskCardId: taskCard.id,
                        selectedDate,
                    },
                })
            },
        })
        .then(() => clearForm())
        .catch((error) => {
            setErrors(error.graphQLErrors?.[0].extensions.exception)
        })
    }, [username, clearForm, createTaskMutation, selectedDate, taskCard.id, formValues.title, formValues.note])

    // Handle form submit
    const handleSubmit = useCallback((event) => {
        event.preventDefault()
        createTask()
    }, [createTask])

    return (
        <>
            {fetchLoading
                ? (renderLoaders(1, <TaskCardLoader />))
                : (
                    <div className="task-card">
                        <div className="task-card__header">
                            <p className="task-card__name">{taskCard.name}</p>
                            <div>
                                <DeleteOutlineRoundedIcon className="task-card__icon" onClick={toggleDeleteDialog} />
                                <EditRoundedIcon className="task-card__icon" onClick={toggleEditDialog} />
                            </div>
                        </div>
                        <div className="task-card__body">
                            {data && data.getTasksByDateAndTaskCard.map(task => (
                                <Task task={task} taskCard={taskCard} key={task.id} />
                            ))}
                        </div>
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
                )
            }
        </>
    )
}
