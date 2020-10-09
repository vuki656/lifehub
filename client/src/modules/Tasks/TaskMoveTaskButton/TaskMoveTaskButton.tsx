import { useMutation } from "@apollo/client"
import * as React from 'react'

import { MOVE_TASK_TO_TODAY } from "../../../graphql/mutations"
import {
    MoveTaskToTodayMutation,
    MoveTaskToTodayMutationVariables,
} from "../../../graphql/types"
import { IconButton } from "../../../ui-kit/components/IconButton"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import { MoveIcon } from "../../../ui-kit/icons/MoveIcon"
import { useTasksCardContext } from "../TasksCardProvider"

import { TaskMoveTaskButtonProps } from "./TaskMoveTaskButton.types"

export const TaskMoveTaskButton: React.FunctionComponent<TaskMoveTaskButtonProps> = (props) => {
    const { task } = props

    const notification = useNotifications()
    const { refetch } = useTasksCardContext()

    const [
        moveTaskToTodayMutation,
        { loading: moveLoading },
    ] = useMutation<MoveTaskToTodayMutation, MoveTaskToTodayMutationVariables>(MOVE_TASK_TO_TODAY)

    const handleClick = async() => {
        await moveTaskToTodayMutation({ variables: { input: { id: task.id } } })
        .then(() => {
            refetch()
        })
        .catch(() => {
            notification.display(
                "Unable to move task to today.",
                "error"
            )
        })
    }

    return (
        <IconButton
            icon={<MoveIcon />}
            loading={moveLoading}
            onClick={handleClick}
            size="small"
            variant="blank"
        />
    )
}
