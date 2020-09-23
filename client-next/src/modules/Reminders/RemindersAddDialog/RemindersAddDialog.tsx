import { useMutation } from "@apollo/client"

import { useFormik } from "formik"
import * as React from 'react'
import { useToggle } from "react-use"
import { CREATE_REMINDER } from "../../../graphql/mutations"
import {
    CreateReminderMutation,
    CreateReminderMutationVariables,
} from "../../../graphql/types"
import { Button } from "../../../ui-kit/components/Button"
import { DatePicker } from "../../../ui-kit/components/DatePicker"
import { Dialog } from "../../../ui-kit/components/Dialog"
import { DialogActions } from "../../../ui-kit/components/DialogActions"
import { TextArea } from "../../../ui-kit/components/TextArea"
import { TextField } from "../../../ui-kit/components/TextField"
import { ReminderAddDialogFormType } from "./ReminderAddDialog.types"

export const RemindersAddDialog: React.FunctionComponent = () => {
    const [
        isDialogOpen,
        toggleDialog,
    ] = useToggle(false)

    const [
        createReminderMutation,
        { loading },
    ] = useMutation<CreateReminderMutation, CreateReminderMutationVariables>(CREATE_REMINDER)

    // TODO: HANDLE CACHE
    // TODO: HANDLE ERRORS => ERROR NOTIF
    const form = useFormik<ReminderAddDialogFormType>({
        initialValues: {
            dueDate: '',
            note: '',
            title: '',
        },
        onSubmit: async(formValues) => {
            await createReminderMutation({
                variables: {
                    input: {
                        dueDate: formValues.dueDate,
                        note: formValues.note,
                        title: formValues.title,
                    },
                },
            })
                .then(() => {
                    toggleDialog()
                    form.resetForm()
                })
        },
    })

    const handleCancel = () => {
        toggleDialog()
        form.resetForm()
    }

    return (
        <>
            <Button
                onClick={toggleDialog}
                variant="outlined"
            >
                Add
            </Button>
            <Dialog
                isOpen={isDialogOpen}
                title="📦 Create Reminder"
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
                            loading={loading}
                            type="submit"
                            variant="primary"
                        >
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
