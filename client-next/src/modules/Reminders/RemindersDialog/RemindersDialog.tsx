import { useFormik } from "formik"
import * as React from 'react'

import { Button } from "../../../ui-kit/components/Button"
import { DatePicker } from "../../../ui-kit/components/DatePicker"
import { Dialog } from "../../../ui-kit/components/Dialog"
import { DialogActions } from "../../../ui-kit/components/DialogActions"
import { TextArea } from "../../../ui-kit/components/TextArea"
import { TextField } from "../../../ui-kit/components/TextField"
import { ReminderDialogFormType } from "../RemindersAddDialog"

import { RemindersDialogProps } from "./RemindersDialog.types"

export const RemindersDialog: React.FunctionComponent<RemindersDialogProps> = (props) => {
    const {
        toggleDialog,
        isOpen,
        onSubmit,
        reminder,
        title,
        titleButton,
        submitButton,
    } = props

    const form = useFormik<ReminderDialogFormType>({
        enableReinitialize: true,
        initialValues: {
            dueDate: reminder?.dueDate ?? '',
            id: reminder?.id ?? '',
            note: reminder?.note ?? '',
            title: reminder?.title ?? '',
        },
        onSubmit: async(formValues) => {
            await onSubmit(formValues)
            form.resetForm({})
        },
    })

    const handleCancel = () => {
        toggleDialog()
        form.resetForm()
    }

    return (
        <Dialog
            isOpen={isOpen}
            title={title}
            titleButton={titleButton}
        >
            <form onSubmit={form.handleSubmit}>
                <TextField
                    autoFocus
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
                    {submitButton}
                </DialogActions>
            </form>
        </Dialog>
    )
}
