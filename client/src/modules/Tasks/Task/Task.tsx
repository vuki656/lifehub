import { useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import * as React from 'react'

import { TOGGLE_TASK } from '../../../graphql/mutations'
import { TASKS } from '../../../graphql/queries/Task'
import {
    TasksQuery,
    TasksQueryVariables,
    ToggleTaskMutation,
    ToggleTaskMutationVariables,
} from '../../../graphql/types'
import { useNotifications } from '../../../ui-kit/components/NotificationProvider'
import { TaskDeleteDialog } from '../TaskDeleteDialog'
import { TaskEditDialog } from '../TaskEditDialog'
import { TaskMoveTaskButton } from '../TaskMoveTaskButton'

import {
    TaskActions,
    TaskCheckbox,
    TaskRoot,
} from './Task.styles'
import { TaskProps } from './Task.types'

export const Task: React.FunctionComponent<TaskProps> = (props) => {
    const {
        task,
        cardId,
        ...other
    } = props

    const router = useRouter()
    const notifications = useNotifications()

    const [
        toggleTaskMutation,
        { loading: toggleLoading },
    ] = useMutation<ToggleTaskMutation, ToggleTaskMutationVariables>(TOGGLE_TASK)

    const handleChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        await toggleTaskMutation({
            update: (cache, mutationResult) => {
                const editedTask = mutationResult.data?.toggleTask

                if (!editedTask) {
                    return
                }

                const existingTasks = cache.readQuery<TasksQuery, TasksQueryVariables>({
                    query: TASKS,
                    variables: {
                        args: {
                            cardId: cardId,
                            date: router.query.selectedDate as string,
                        },
                    },
                })

                const updatedTasks = existingTasks?.tasks.map((task) => {
                    if (task.id === editedTask.id) {
                        return {
                            ...task,
                            isCompleted: editedTask.isCompleted,
                        }
                    }

                    return task
                }) ?? []

                cache.writeQuery<TasksQuery, TasksQueryVariables>({
                    data: { tasks: updatedTasks },
                    query: TASKS,
                    variables: {
                        args: {
                            cardId: cardId,
                            date: router.query.selectedDate as string,
                        },
                    },
                })
            },
            variables: {
                input: {
                    isCompleted: event.target.checked,
                    taskId: task.id,
                },
            },
        })
        .catch(() => {
            notifications.display(
                'Unable to toggle task.',
                'error'
            )
        })
    }

    return (
        <TaskRoot {...other}>
            <TaskCheckbox
                checked={task.isCompleted}
                disabled={toggleLoading}
                label={task.title}
                onChange={handleChange}
            />
            <TaskActions>
                {dayjs(router.query.selectedDate as string).isSame(new Date, 'date')
                    ? null
                    : <TaskMoveTaskButton task={task} />
                }
                <TaskEditDialog task={task} />
                <TaskDeleteDialog task={task} />
            </TaskActions>
        </TaskRoot>
    )
}
