import { useMutation } from "@apollo/client"
import * as React from 'react'
import { useToggle } from "react-use"

import { EDIT_TASK } from "../../../graphql/mutations"
import {
    EditTaskMutation,
    EditTaskMutationVariables,
} from "../../../graphql/types"
import { Button } from "../../../ui-kit/components/Button"
import { IconButton } from "../../../ui-kit/components/IconButton"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import { PencilIcon } from "../../../ui-kit/icons/PencilIcon"
import {
    TaskDialog,
    TaskDialogFormType,
} from "../TaskDialog"
import { useTasksCardContext } from "../TasksCardProvider"

import { TaskEditDialogProps } from "./TaskEditDialog.types"

export const TaskEditDialog: React.FunctionComponent<TaskEditDialogProps> = (props) => {
    const { task } = props

    const { refetch } = useTasksCardContext()

    const notification = useNotifications()

    const [
        isDialogOpen,
        toggleDialog,
    ] = useToggle(false)

    const [
        editTaskMutation,
        { loading: editLoading },
    ] = useMutation<EditTaskMutation, EditTaskMutationVariables>(EDIT_TASK)

    const handleSubmit = async(formValues: TaskDialogFormType) => {
        if (!formValues.id) {
            return
        }

        await editTaskMutation({
            variables: {
                input: {
                    date: formValues.date,
                    id: formValues.id,
                    isCompleted: formValues.isCompleted,
                    note: formValues.note ?? '',
                    title: formValues.title,
                },
            },
        })
        .then(() => {
            refetch()
            toggleDialog()

            notification.display(
                "Task edited successfully",
                "success"
            )
        })
        .catch(() => {
            notification.display(
                "Unable to edit task",
                "error"
            )
        })
    }

    return (
        <>
            <IconButton
                icon={<PencilIcon />}
                onClick={toggleDialog}
                size="small"
                variant="blank"
            />
            <TaskDialog
                isOpen={isDialogOpen}
                onSubmit={handleSubmit}
                submitButton={
                    <Button
                        loading={editLoading}
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                }
                task={task}
                title="✏️ Edit Task"
                toggleDialog={toggleDialog}
            />
        </>
    )
}
