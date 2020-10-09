import { useMutation } from "@apollo/client"
import * as React from 'react'
import { useToggle } from "react-use"

import { CREATE_REMINDER } from "../../../graphql/mutations"
import {
    CreateReminderMutation,
    CreateReminderMutationVariables,
} from "../../../graphql/types"
import { Button } from "../../../ui-kit/components/Button"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import {
    ReminderDialogFormType,
    RemindersDialog,
} from "../RemindersDialog"

import { ReminderAddDialogProps } from "./ReminderAddDialog.types"

export const RemindersAddDialog: React.FunctionComponent<ReminderAddDialogProps> = (props) => {
    const { onSubmit } = props

    const notification = useNotifications()

    const [
        isDialogOpen,
        toggleDialog,
    ] = useToggle(false)

    const [
        createReminderMutation,
        { loading: createLoading },
    ] = useMutation<CreateReminderMutation, CreateReminderMutationVariables>(CREATE_REMINDER)

    const handleSubmit = async(formValues: ReminderDialogFormType) => {
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
            onSubmit()
            toggleDialog()

            notification.display(
                "Successfully created reminder.",
                "success"
            )
        })
        .catch(() => {
            notification.display(
                "Unable to create reminder.",
                "error"
            )
        })
    }

    return (
        <>
            <Button
                onClick={toggleDialog}
                variant="outlined"
            >
                Add
            </Button>
            <RemindersDialog
                isOpen={isDialogOpen}
                onSubmit={handleSubmit}
                submitButton={
                    <Button
                        loading={createLoading}
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                }
                title="📦 Create Reminder"
                toggleDialog={toggleDialog}
            />
        </>
    )
}
