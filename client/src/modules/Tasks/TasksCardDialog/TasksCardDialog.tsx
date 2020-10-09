import { useFormik } from "formik"
import * as React from 'react'

import { Button } from "../../../ui-kit/components/Button"
import { Dialog } from "../../../ui-kit/components/Dialog"
import { DialogActions } from "../../../ui-kit/components/DialogActions"
import { TextField } from "../../../ui-kit/components/TextField"
import { CardDialogFormType } from "../TasksAddCardDialog/TasksAddCardDialog.types"

import { TasksCardDialogProps } from "./TasksCardDialog.types"

export const TasksCardDialog: React.FunctionComponent<TasksCardDialogProps> = (props) => {
    const {
        submitButton,
        title,
        toggleDialog,
        isOpen,
        onSubmit,
        card,
    } = props

    const form = useFormik<CardDialogFormType>({
        enableReinitialize: true,
        initialValues: {
            id: card?.id ?? '',
            name: card?.name ?? '',
        },
        onSubmit: async(formValues) => {
            await onSubmit(formValues)
            form.resetForm({})
        },
    })

    const handleCancel = () => {
        toggleDialog()
        form.resetForm({})
    }

    return (
        <Dialog
            isOpen={isOpen}
            title={title}
        >
            <form onSubmit={form.handleSubmit}>
                <TextField
                    autoFocus
                    label="Name"
                    name="name"
                    onChange={form.handleChange}
                    value={form.values.name}
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
