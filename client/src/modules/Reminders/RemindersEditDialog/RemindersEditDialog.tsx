import { useMutation } from "@apollo/client"
import * as React from 'react'

import {
    DELETE_REMINDER,
    EDIT_REMINDER,
} from "../../../graphql/mutations"
import {
    DeleteReminderMutation,
    DeleteReminderMutationVariables,
    EditReminderMutation,
    EditReminderMutationVariables,
} from "../../../graphql/types"
import { Button } from "../../../ui-kit/components/Button"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import {
    ReminderDialogFormType,
    RemindersDialog,
} from "../RemindersDialog"

import { RemindersDialogProps } from "./RemindersEditDialog.types"

export const RemindersEditDialog: React.FunctionComponent<RemindersDialogProps> = (props) => {
    const {
        toggleDialog,
        isDialogOpen,
        onSubmit,
        reminder,
    } = props

    const notification = useNotifications()

    const [
        editReminderMutation,
        { loading: editLoading },
    ] = useMutation<EditReminderMutation, EditReminderMutationVariables>(EDIT_REMINDER)

    const [
        deleteReminderMutation,
        { loading: deleteLoading },
    ] = useMutation<DeleteReminderMutation, DeleteReminderMutationVariables>(DELETE_REMINDER)

    const handleDelete = async() => {
        await deleteReminderMutation({ variables: { id: reminder.id } })
        .then(() => {
            onSubmit()
            toggleDialog()

            notification.display(
                "Successfully deleted reminder.",
                "success"
            )
        })
        .catch(() => {
            notification.display(
                "Unable to delete reminder.",
                "error"
            )
        })
    }

    const handleSubmit = async(formValues: ReminderDialogFormType) => {
        if (!formValues.id) {
            return
        }

        await editReminderMutation({
            variables: {
                input: {
                    dueDate: formValues.dueDate,
                    id: formValues.id,
                    note: formValues.note,
                    title: formValues.title,
                },
            },
        })
        .then(() => {
            onSubmit()
            toggleDialog()

            notification.display(
                "Successfully edited reminder.",
                "success"
            )
        })
        .catch(() => {
            notification.display(
                "Unable to edit reminder.",
                "error"
            )
        })
    }

    return (
        <RemindersDialog
            isOpen={isDialogOpen}
            onSubmit={handleSubmit}
            reminder={reminder}
            submitButton={
                <Button
                    loading={editLoading}
                    type="submit"
                    variant="primary"
                >
                    Edit
                </Button>
            }
            title="✏️ Edit Reminder"
            titleButton={
                <Button
                    loading={deleteLoading}
                    onClick={handleDelete}
                    variant="outlined"
                >
                    Delete
                </Button>
            }
            toggleDialog={toggleDialog}
        />
    )
}
