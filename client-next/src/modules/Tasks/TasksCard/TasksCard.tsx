import { useMutation } from "@apollo/client"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import * as React from 'react'

import { CREATE_TASK } from "../../../graphql/mutations"
import {
    CreateTaskMutation,
    CreateTaskMutationVariables,
} from "../../../graphql/types"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import { TextField } from "../../../ui-kit/components/TextField"
import { AddIcon } from "../../../ui-kit/icons/AddIcon"
import { TasksCardDeleteDialog } from "../TasksCardDeleteDialog"
import { TasksCardEditDialog } from "../TasksCardEditDialog"

import {
    SubmitButton,
    TasksCardActions,
    TasksCardForm,
    TasksCardHeader,
    TasksCardRoot,
    TasksCardTitle,
} from "./TasksCard.styles"
import {
    CreateTaskFormType,
    TasksCardProps,
} from "./TasksCard.types"

export const TasksCard: React.FunctionComponent<TasksCardProps> = (props) => {
    const { card } = props

    const notifications = useNotifications()
    const { query } = useRouter()

    const [
        createTaskMutation,
        { loading: createLoading },
    ] = useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CREATE_TASK)

    const form = useFormik<CreateTaskFormType>({
        initialValues: { title: '' },
        onSubmit: async(formValues) => {
            if (!card.id) {
                return
            }

            await createTaskMutation({
                variables: {
                    input: {
                        cardId: card.id,
                        date: query.selectedDate as string,
                        title: formValues.title,
                    },
                },
            })
            .then(() => {
                form.resetForm({})

                notifications.display(
                    "Task created successfully",
                    "success"
                )
            })
            .catch(() => {
                notifications.display(
                    "Unable to create task.",
                    "error"
                )
            })
        },
    },)

    return (
        <TasksCardRoot>
            <TasksCardHeader>
                <TasksCardTitle>
                    {card.name}
                </TasksCardTitle>
                <TasksCardActions>
                    <TasksCardEditDialog card={card} />
                    <TasksCardDeleteDialog card={card} />
                </TasksCardActions>
            </TasksCardHeader>
            <TasksCardForm onSubmit={form.handleSubmit}>
                <TextField
                    fullWidth
                    name="title"
                    onChange={form.handleChange}
                    required
                    type="text"
                    value={form.values.title}
                />
                <SubmitButton
                    icon={<AddIcon />}
                    loading={createLoading}
                    type="submit"
                    variant="outlined"
                />
            </TasksCardForm>
        </TasksCardRoot>
    )
}
