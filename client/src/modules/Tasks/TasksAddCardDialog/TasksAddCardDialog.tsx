import { useMutation } from '@apollo/client'
import * as React from 'react'
import { useToggle } from 'react-use'

import { CREATE_CARD } from '../../../graphql/mutations'
import { CARDS } from '../../../graphql/queries'
import {
    CardsQuery,
    CreateCardMutation,
    CreateCardMutationVariables,
} from '../../../graphql/types'
import { Button } from '../../../ui-kit/components/Button'
import { useNotifications } from '../../../ui-kit/components/NotificationProvider'
import { TasksCardDialog } from '../TasksCardDialog'

import { AddCardIcon } from './TasksAddCardDialog.styles'
import { CardDialogFormType } from './TasksAddCardDialog.types'

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

    const handleSubmit = async(formValues: CardDialogFormType) => {
        await createCardMutation({
            update: (cache, mutationResult) => {
                const createdItem = mutationResult.data?.createCard.card

                if (!createdItem) {
                    return
                }

                const existingList = cache.readQuery<CardsQuery>({ query: CARDS })

                const updatedList = [
                    ...existingList?.cards ?? [],
                    createdItem,
                ] ?? []

                cache.writeQuery<CardsQuery>({
                    data: { cards: updatedList },
                    query: CARDS,
                })
            },
            variables: { input: { name: formValues.name } },
        })
        .then(() => {
            toggleDialog()

            notifications.display(
                'Card created successfully.',
                'success'
            )
        })
        .catch(() => {
            notifications.display(
                'Unable to create card.',
                'error'
            )
        })
    }

    return (
        <>
            <Button
                endIcon={<AddCardIcon />}
                onClick={toggleDialog}
                variant="primary"
            >
                New Card
            </Button>
            <TasksCardDialog
                isOpen={isDialogOpen}
                onSubmit={handleSubmit}
                submitButton={
                    <Button
                        loading={createLoading}
                        type="submit"
                        variant="primary"
                    >
                        Create
                    </Button>
                }
                title="📦 Create Card"
                toggleDialog={toggleDialog}
            />
        </>
    )
}
