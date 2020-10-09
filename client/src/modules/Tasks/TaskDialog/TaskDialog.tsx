import { useFormik } from 'formik'
import * as React from 'react'

import { Button } from '../../../ui-kit/components/Button'
import { DatePicker } from '../../../ui-kit/components/DatePicker'
import { Dialog } from '../../../ui-kit/components/Dialog'
import { DialogActions } from '../../../ui-kit/components/DialogActions'
import { TextArea } from '../../../ui-kit/components/TextArea'
import { TextField } from '../../../ui-kit/components/TextField'

import {
    TaskDialogFormType,
    TaskDialogProps,
} from './TaskDialog.types'

export const TaskDialog: React.FunctionComponent<TaskDialogProps> = (props) => {
    const {
        toggleDialog,
        isOpen,
        onSubmit,
        task,
        title,
        titleButton,
        submitButton,
    } = props

    const form = useFormik<TaskDialogFormType>({
        enableReinitialize: true,
        initialValues: {
            date: task.date ?? '',
            id: task.id ?? '',
            isCompleted: task.isCompleted,
            note: task.note ?? '',
            title: task.title ?? '',
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
                    maxLength={150}
                    name="title"
                    onChange={form.handleChange}
                    required
                    value={form.values.title}
                />
                <TextArea
                    fullWidth
                    label="Note"
                    maxLength={2000}
                    name="note"
                    onChange={form.handleChange}
                    rows={7}
                    value={form.values.note}
                />
                <DatePicker
                    fullWidth
                    label="Date"
                    minDate={new Date()}
                    onChange={(selectedDate) => form.setFieldValue('date', selectedDate)}
                    required
                    selected={form.values.date}
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
