import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded'
import EditRoundedIcon from '@material-ui/icons/EditRounded'
import { useFormik } from 'formik'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { LoadingSpinner } from '../../../../components/LoadingSpinner'
import { Message } from '../../../../components/Message'
import { UserStateType } from '../../../../redux/reducers/user'
import { renderLoaders } from '../../../../util/helpers/renderLoaders'
import { TaskCardDeleteDialog } from '../TaskCardDeleteDialog'
import { TaskCardDialog } from '../TaskCardDialog'
import { TaskCardLoader } from '../TaskCardLoader'

import type {
    CreateTaskFormTypes,
    TaskCardProps,
} from './TaskCard.types'

export const TaskCard: React.FC<TaskCardProps> = (props) => {
    const { taskCard } = props

    const [isEditDialogOpen, toggleEditDialog] = useToggle(false)
    const [isDeleteDialogOpen, toggleDeleteDialog] = useToggle(false)
    const [errors, setErrors] = React.useState<{ error?: string }>()
    const { selectedDate } = useSelector((state: UserStateType) => state)
    //
    // const [createTaskMutation, { loading: createLoading }] = useMutation<createTaskResponse, createTaskVariables>(
    //     CREATE_TASK,
    //     {
    //         onError: (error) => {
    //             setErrors({ error: error.message })
    //         },
    //     },
    // )
    // const {
    //     data, loading: fetchLoading,
    // } = useQuery<getTasksByDateAndTaskCardResponse, getTasksByDateAndTaskCardVariables>(
    //     GET_TASKS_BY_DATE_AND_TASK_CARD, {
    //         fetchPolicy: 'network-only',
    //         variables: {
    //             input: {
    //                 selectedDate,
    //                 taskCardId: taskCard.id,
    //             },
    //         },
    //     })

    const createTaskForm = useFormik<CreateTaskFormTypes>({
        initialValues: { title: '' },
        onSubmit: (formValues) => handleSubmit(formValues),
    })

    // Save task
    const handleSubmit = useCallback((formValues: CreateTaskFormTypes) => {
        // createTaskMutation({
        //     update(cache, response) {
        //         const localCache = cache.readQuery<getTasksByDateAndTaskCardResponse>({
        //             query: GET_TASKS_BY_DATE_AND_TASK_CARD,
        //             variables: {
        //                 input: {
        //                     selectedDate,
        //                     taskCardId: taskCard.id,
        //                 },
        //             },
        //         })
        //         cache.writeQuery({
        //             data: {
        //                 getTasksByDateAndTaskCard: {
        //                     __typename: response.data?.createTask.__typename,
        //                     tasks: _.concat(
        //                         localCache?.getTasksByDateAndTaskCard.tasks,
        //                         { ...response.data?.createTask.task },
        //                     ),
        //                 },
        //             },
        //             query: GET_TASKS_BY_DATE_AND_TASK_CARD,
        //             variables: {
        //                 input: {
        //                     selectedDate,
        //                     taskCardId: taskCard.id,
        //                 },
        //             },
        //         })
        //     },
        //     variables: {
        //         input: {
        //             date: selectedDate,
        //             taskMetaData: {
        //                 taskCard: taskCard.id,
        //                 title: formValues.title,
        //             },
        //         },
        //     },
        // })
        // .then(() => {
        //     createTaskForm.resetForm()
        //     setErrors({})
        // })
        // .catch((error) => {
        //     setErrors(error.graphQLErrors?.[0].extensions.exception)
        // })
    }, [selectedDate, taskCard.id, createTaskForm])

    return (
        <>
            {/* {fetchLoading */}
            {/* eslint-disable-next-line no-constant-condition */}
            {false
                ? (renderLoaders(1, <TaskCardLoader />))
                : (
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
                        {/* <div className="task-card__body"> */}
                        {/*    {data?.getTasksByDateAndTaskCard.tasks.map((task) => ( */}
                        {/*        <Task task={task} taskCard={taskCard} key={task.id} /> */}
                        {/*    ))} */}
                        {/* </div> */}
                        <div className="task-card__input">
                            <form onSubmit={createTaskForm.handleSubmit}>
                                {/* {createLoading */}
                                {/* eslint-disable-next-line no-constant-condition */}
                                {false
                                    ? <LoadingSpinner loaderColor={'blue'} loaderVariant={'button'} />
                                    : (
                                        <input
                                            className="form__input-field task-card__input-field"
                                            type="text"
                                            required
                                            placeholder="Click to quickly add a task"
                                            name="title"
                                            onChange={createTaskForm.handleChange}
                                            value={createTaskForm.values.title}
                                            maxLength={150}
                                        />
                                    )}
                            </form>
                        </div>
                        {errors?.error && <Message message={errors.error} type="error" />}
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
