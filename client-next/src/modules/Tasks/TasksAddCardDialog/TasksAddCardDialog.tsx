import { useMutation } from "@apollo/client"
import { useFormik } from "formik"
import * as React from 'react'
import { useToggle } from "react-use"

import { CREATE_CARD } from "../../../graphql/mutations"
import {
    CreateCardMutation,
    CreateCardMutationVariables,
} from "../../../graphql/types"
import { Button } from "../../../ui-kit/components/Button"
import { Dialog } from "../../../ui-kit/components/Dialog"
import { DialogActions } from "../../../ui-kit/components/DialogActions"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider/useNotifications"
import { TextField } from "../../../ui-kit/components/TextField"

import { CardDialogFormType } from "./TasksAddCardDialog.types"

export const TasksAddCardDialog: React.FunctionComponent = () => {
    const notifications = useNotifications()

    const [
        isDialogOpen,
        toggleDialog,
    ] = useToggle(false)

    const [
        createCardMutation,
        { loading: createLoading },
    ] = useMutation<CreateCardMutation, CreateCardMutationVariables>(CREATE_CARD)

    const form = useFormik<CardDialogFormType>({
        initialValues: { name: '' },
        onSubmit: (formValues) => {
            createCardMutation({ variables: { input: { name: formValues.name } } })
            .then(() => {
                toggleDialog()
                form.resetForm({})

                notifications.display("Card created successfully.", "success")
            })
            .catch(() => {
                notifications.display("Unable to create card.", "error")
            })
        },
    })

    const handleCancel = () => {
        toggleDialog()
        form.resetForm({})
    }

    return (
        <>
            <Button
                onClick={toggleDialog}
                variant="primary"
            >
                New Card
            </Button>
            <Dialog
                isOpen={isDialogOpen}
                title="📦 Create Card"
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
                        <Button
                            loading={createLoading}
                            type="submit"
                            variant="primary"
                        >
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}
