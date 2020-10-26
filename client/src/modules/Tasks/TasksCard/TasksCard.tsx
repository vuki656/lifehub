import {
    useMutation,
    useQuery,
} from '@apollo/client'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import * as React from 'react'
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd'

import {
    CREATE_TASK,
    EDIT_TASK_SEQUENCE,
} from '../../../graphql/mutations'
import { TASKS } from '../../../graphql/queries/Task'
import {
    CreateTaskMutation,
    CreateTaskMutationVariables,
    EditTaskSequenceMutation,
    EditTaskSequenceMutationVariables,
    TasksQuery,
    TasksQueryVariables,
} from '../../../graphql/types'
import { useNotifications } from '../../../ui-kit/components/NotificationProvider'
import { TextField } from '../../../ui-kit/components/TextField'
import { AddIcon } from '../../../ui-kit/icons/AddIcon'
import {
    Task,
    TaskType,
} from '../Task'
import { TasksCardDeleteDialog } from '../TasksCardDeleteDialog'
import { TasksCardEditDialog } from '../TasksCardEditDialog'
import { TasksCardProvider } from '../TasksCardProvider'

import {
    SubmitButton,
    TasksCardActions,
    TasksCardForm,
    TasksCardHeader,
    TasksCardRoot,
    TasksCardTasks,
    TasksCardTitle,
} from './TasksCard.styles'
import {
    CreateTaskFormType,
    TasksCardProps,
} from './TasksCard.types'

export const TasksCard: React.FunctionComponent<TasksCardProps> = (props) => {
    const { card } = props

    const notifications = useNotifications()
    const router = useRouter()

    const [editTaskSequenceMutation] = useMutation<EditTaskSequenceMutation, EditTaskSequenceMutationVariables>(EDIT_TASK_SEQUENCE)

    const {
        data: tasksResult,
        refetch,
    } = useQuery<TasksQuery, TasksQueryVariables>(TASKS, {
        fetchPolicy: 'cache-and-network',
        onError: () => {
            notifications.display(
                'Unable to fetch tasks',
                'error'
            )
        },
        variables: {
            args: {
                cardId: card.id,
                date: router.query.selectedDate as string,
            },
        },
    })

    const [
        createTaskMutation,
        { loading: createLoading },
    ] = useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CREATE_TASK)

    const form = useFormik<CreateTaskFormType>({
        initialValues: { title: '' },
        onSubmit: async(formValues) => {
            await createTaskMutation({
                variables: {
                    input: {
                        cardId: card.id,
                        date: router.query.selectedDate as string,
                        title: formValues.title,
                    },
                },
            })
            .then(() => {
                form.resetForm({})
                refetch()
            })
            .catch(() => {
                notifications.display(
                    'Unable to create task.',
                    'error'
                )
            })
        },
    },)

    // Sort tasks by sequence number
    const sortedTasks = tasksResult?.tasks.slice().sort((a, b) => {
        return a.sequenceNumber - b.sequenceNumber
    }) ?? []

    const handleDragEnd = async(result: DropResult) => {
        if (!result.destination) {
            return
        }

        const fromIndex = result.source.index
        const toIndex = result.destination.index

        // Remove the element from old spot
        const [removedElement] = sortedTasks.splice(fromIndex, 1)

        // Add element to the new spot
        sortedTasks.splice(toIndex, 0, removedElement)

        await editTaskSequenceMutation({
            optimisticResponse: {
                __typename: 'Mutation',
                editTaskSequence: sortedTasks.map((task, index) => ({
                    __typename: 'EditTaskSequencePayload',
                    id: task.id,
                    sequenceNumber: index + 1,
                })),
            },
            update: (proxy, mutationResult) => {
                const data = proxy.readQuery<TasksQuery, TasksQueryVariables>({
                    query: TASKS,
                    variables: {
                        args: {
                            cardId: card.id,
                            date: router.query.selectedDate as string,
                        },
                    },
                })

                const updatedList: TaskType[] = data?.tasks.map((existingTask) => {
                    const updatedTask = mutationResult.data?.editTaskSequence.find((updatedTask) => {
                        return existingTask.id === updatedTask.id
                    })

                    return {
                        ...existingTask,
                        ...updatedTask,
                        __typename: 'TaskType',
                    }
                }) ?? []

                proxy.writeQuery<TasksQuery, TasksQueryVariables>({
                    data: { tasks: updatedList },
                    query: TASKS,
                    variables: {
                        args: {
                            cardId: card.id,
                            date: router.query.selectedDate as string,
                        },
                    },
                })
            },
            variables: {
                input: sortedTasks.map((task, index) => ({
                    id: task.id,
                    sequenceNumber: index + 1,
                })),
            },
        })
        .catch(() => {
            notifications.display(
                'Unable to reorder tasks.',
                'error'
            )
        })
    }

    return (
        <TasksCardProvider refetch={refetch}>
            <TasksCardRoot>
                <TasksCardHeader>
                    <TasksCardTitle>
                        {card.name}
                    </TasksCardTitle>
                    <TasksCardActions>
                        <TasksCardEditDialog card={card} />
                        <TasksCardDeleteDialog card={card} />
                    </TasksCardActions>
                </TasksCardHeader>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="cardTasksListDroppable">
                        {(provided) => (
                            <TasksCardTasks
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {sortedTasks.map((task, index) => {
                                    return (
                                        <Draggable
                                            draggableId={task.id}
                                            index={index}
                                            key={task.id}
                                        >
                                            {(provided) => (
                                                <Task
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    cardId={card.id}
                                                    innerRef={provided.innerRef}
                                                    key={task.id}
                                                    style={{ ...provided.draggableProps.style }}
                                                    task={task}
                                                />
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </TasksCardTasks>
                        )}
                    </Droppable>
                </DragDropContext>
                <TasksCardForm onSubmit={form.handleSubmit}>
                    <TextField
                        fullWidth
                        maxLength={150}
                        name="title"
                        onChange={form.handleChange}
                        required
                        type="text"
                        value={form.values.title}
                    />
                    <SubmitButton
                        icon={<AddIcon />}
                        loading={createLoading}
                        type="submit"
                        variant="outlined"
                    />
                </TasksCardForm>
            </TasksCardRoot>
        </TasksCardProvider>
    )
}
