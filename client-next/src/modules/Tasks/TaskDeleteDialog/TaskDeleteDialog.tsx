import { useMutation } from "@apollo/client"
import * as React from 'react'
import { useToggle } from "react-use"

import { DeleteDialog } from "../../../components/DeleteDialog"
import { DELETE_TASK } from "../../../graphql/mutations"
import {
    DeleteTaskMutation,
    DeleteTaskMutationVariables,
} from "../../../graphql/types"
import { IconButton } from "../../../ui-kit/components/IconButton"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import { TrashIcon } from "../../../ui-kit/icons/TrashIcon"
import { useTasksCardContext } from "../TasksCardProvider"

import { TaskDeleteDialogProps } from "./TaskDeleteDialog.types"

export const TaskDeleteDialog: React.FunctionComponent<TaskDeleteDialogProps> = (props) => {
    const { task } = props

    const notification = useNotifications()
    const { refetch } = useTasksCardContext()

    const [
        isDialogOpen,
        toggleDialog,
    ] = useToggle(false)

    const [
        deleteTaskMutation,
        { loading: deleteLoading },
    ] = useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DELETE_TASK)

    const handleDelete = async() => {
        await deleteTaskMutation({ variables: { input: { id: task.id } } })
        .then(() => {
            refetch()
            toggleDialog()

            notification.display(
                "Task deleted successfully",
                "success"
            )
        })
        .catch(() => {
            notification.display(
                "Unable to delete task",
                "error"
            )
        })
    }

    return (
        <>
            <IconButton
                icon={<TrashIcon />}
                onClick={toggleDialog}
                size="small"
                variant="blank"
            />
            <DeleteDialog
                isOpen={isDialogOpen}
                loading={deleteLoading}
                name={task.title}
                onDelete={handleDelete}
                toggleDialog={toggleDialog}
            />
        </>
    )
}
