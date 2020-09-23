import { useFormik } from "formik"
import * as React from 'react'
import { useToggle } from "react-use"
import { Button } from "../../../ui-kit/components/Button"
import { Dialog } from "../../../ui-kit/components/Dialog"
import { DialogActions } from "../../../ui-kit/components/DialogActions"
import { TextArea } from "../../../ui-kit/components/TextArea"
import { TextField } from "../../../ui-kit/components/TextField"
import { ReminderAddDialogFormType } from "./ReminderAddDialog.types"

export const RemindersAddDialog: React.FunctionComponent = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)

    const form = useFormik<ReminderAddDialogFormType>({
        initialValues: {
            description: '',
            title: '',
        },
        onSubmit: (formValues) => {
            console.log(formValues)
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
                        label="Description"
                        name="description"
                        onChange={form.handleChange}
                        required
                        rows={8}
                        value={form.values.description}
                    />
                    <DialogActions>
                        <Button
                            onClick={handleCancel}
                            variant="outlined"
                        >
                        Cancel
                        </Button>
                        <Button
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
