import { useMutation } from "@apollo/client"
import * as React from 'react'
import { useToggle } from "react-use"

import { EDIT_CARD } from "../../../graphql/mutations"
import {
    EditCardMutation,
    EditCardMutationVariables,
} from "../../../graphql/types"
import { Button } from "../../../ui-kit/components/Button"
import { IconButton } from "../../../ui-kit/components/IconButton"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import { PencilIcon } from "../../../ui-kit/icons/PencilIcon"
import { CardDialogFormType } from "../TasksAddCardDialog/TasksAddCardDialog.types"
import { TasksCardDialog } from "../TasksCardDialog"

import { TasksCardEditDialogProps } from "./TasksCardEditDialog.types"

export const TasksCardEditDialog: React.FunctionComponent<TasksCardEditDialogProps> = (props) => {
    const { card } = props

    const notifications = useNotifications()

    const [
        isDialogOpen,
        toggleDialog,
    ] = useToggle(false)

    const [
        editCardMutation,
        { loading: editLoading },
    ] = useMutation<EditCardMutation, EditCardMutationVariables>(EDIT_CARD)

    const handleSubmit = async(formValues: CardDialogFormType) => {
        if (!formValues.id) {
            return
        }

        await editCardMutation({
            variables: {
                input: {
                    id: formValues.id,
                    name: formValues.name,
                },
            },
        })
        .then(() => {
            toggleDialog()

            notifications.display(
                "Card edited successfully",
                "success"
            )
        })
        .catch(() => {
            notifications.display(
                "Unable to edit card",
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
                variant="outlined"
            />
            <TasksCardDialog
                card={card}
                isOpen={isDialogOpen}
                onSubmit={handleSubmit}
                submitButton={
                    <Button
                        loading={editLoading}
                        type="submit"
                        variant="primary"
                    >
                        Edit
                    </Button>
                }
                title="✏️ Edit Card"
                toggleDialog={toggleDialog}
            />
        </>
    )
}
