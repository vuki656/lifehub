import { useMutation } from "@apollo/client"
import * as React from 'react'
import { useToggle } from "react-use"

import { DeleteDialog } from "../../../components/DeleteDialog"
import { DELETE_CARD } from "../../../graphql/mutations"
import { CARDS } from "../../../graphql/queries"
import {
    CardsQuery,
    DeleteCardMutation,
    DeleteCardMutationVariables,
} from "../../../graphql/types"
import { IconButton } from "../../../ui-kit/components/IconButton"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import { TrashIcon } from "../../../ui-kit/icons/TrashIcon"

import { TasksCardDeleteDialogProps } from "./TasksCardDeleteDialog.types"

export const TasksCardDeleteDialog: React.FunctionComponent<TasksCardDeleteDialogProps> = (props) => {
    const { card } = props

    const notifications = useNotifications()

    const [
        isDialogOpen,
        toggleDialog,
    ] = useToggle(false)

    const [
        deleteCardMutation,
        { loading: deleteLoading },
    ] = useMutation<DeleteCardMutation, DeleteCardMutationVariables>(DELETE_CARD)

    const handleDelete = async() => {
        if (!card.id) {
            return
        }

        await deleteCardMutation({
            update: (cache, mutationResult) => {
                toggleDialog()
                notifications.display(
                    `Card deleted successfully.`,
                    "success"
                )

                const deletedItemId = mutationResult.data?.deleteCard.id

                if (!deletedItemId) {
                    return
                }

                const existingList = cache.readQuery<CardsQuery>({ query: CARDS })

                const updatedList = existingList?.cards.filter((item) => {
                    return item.id !== deletedItemId
                }) ?? []

                cache.writeQuery<CardsQuery>({
                    data: { cards: updatedList },
                    query: CARDS,
                })
            },
            variables: { input: { id: card.id } },
        })
        .catch(() => {
            notifications.display(
                `Unable to delete card.`,
                "error"
            )
        })
    }

    return (
        <>
            <IconButton
                icon={<TrashIcon />}
                onClick={toggleDialog}
                size="small"
                variant="outlined"
            />
            <DeleteDialog
                isOpen={isDialogOpen}
                loading={deleteLoading}
                name={card.name}
                onDelete={handleDelete}
                toggleDialog={toggleDialog}

            />
        </>
    )
}
