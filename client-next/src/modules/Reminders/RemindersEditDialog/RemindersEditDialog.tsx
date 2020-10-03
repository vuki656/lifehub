import { useMutation } from "@apollo/client"
import { useFormik } from "formik"
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
import { DatePicker } from "../../../ui-kit/components/DatePicker"
import { Dialog } from "../../../ui-kit/components/Dialog"
import { DialogActions } from "../../../ui-kit/components/DialogActions"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider/useNotifications"
import { TextArea } from "../../../ui-kit/components/TextArea"
import { TextField } from "../../../ui-kit/components/TextField"
import { ReminderDialogFormType } from "../RemindersAddDialog"

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

    const form = useFormik<ReminderDialogFormType>({
        enableReinitialize: true,
        initialValues: {
            dueDate: reminder.dueDate,
            id: reminder.id,
            note: reminder.note,
            title: reminder.title,
        },
        onSubmit: async(formValues) => {
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
                form.resetForm()

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
        },
    })

    const handleDeleteClick = async() => {
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

    const handleCancel = () => {
        toggleDialog()
        form.resetForm()
    }

    return (
        <Dialog
            isOpen={isDialogOpen}
            title="✏️ Edit Reminder"
            titleButton={
                <Button
                    loading={deleteLoading}
                    onClick={handleDeleteClick}
                    variant="outlined"
                >
                    Delete
                </Button>
            }
        >
            <form onSubmit={form.handleSubmit}>
                <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    onChange={form.handleChange}
                    required
                    value={form.values.title}
                />
                <TextArea
                    fullWidth
                    label="Note"
                    name="note"
                    onChange={form.handleChange}
                    rows={8}
                    value={form.values.note}
                />
                <DatePicker
                    fullWidth
                    label="Due Date"
                    minDate={new Date()}
                    onChange={(selectedDate) => form.setFieldValue("dueDate", selectedDate)}
                    required
                    selected={form.values.dueDate}
                />
                <DialogActions>
                    <Button
                        onClick={handleCancel}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={deleteLoading}
                        loading={editLoading}
                        type="submit"
                        variant="primary"
                    >
                        Edit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
