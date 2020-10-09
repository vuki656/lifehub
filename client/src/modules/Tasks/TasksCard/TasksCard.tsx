import {
    useMutation,
    useQuery,
} from "@apollo/client"
import { useFormik } from "formik"
import { useRouter } from "next/router"
import * as React from 'react'

import { CREATE_TASK } from "../../../graphql/mutations"
import { TASKS } from "../../../graphql/queries/Task"
import {
    CreateTaskMutation,
    CreateTaskMutationVariables,
    TasksQuery,
    TasksQueryVariables,
} from "../../../graphql/types"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import { TextField } from "../../../ui-kit/components/TextField"
import { AddIcon } from "../../../ui-kit/icons/AddIcon"
import { Task } from "../Task"
import { TasksCardDeleteDialog } from "../TasksCardDeleteDialog"
import { TasksCardEditDialog } from "../TasksCardEditDialog"
import { TasksCardProvider } from "../TasksCardProvider"

import {
    SubmitButton,
    TasksCardActions,
    TasksCardForm,
    TasksCardHeader,
    TasksCardRoot,
    TasksCardTasks,
    TasksCardTitle,
} from "./TasksCard.styles"
import {
    CreateTaskFormType,
    TasksCardProps,
} from "./TasksCard.types"

export const TasksCard: React.FunctionComponent<TasksCardProps> = (props) => {
    const { card } = props

    const notifications = useNotifications()
    const router = useRouter()

    const {
        data: tasksResult,
        refetch,
    } = useQuery<TasksQuery, TasksQueryVariables>(TASKS, {
        fetchPolicy: "network-only",
        onError: () => {
            notifications.display(
                "Unable to fetch tasks",
                "error"
            )
        },
        variables: {
            args: {
                cardId: card.id,
                date: router.query.selectedDate as string,
            },
        },
    })

    const [
        createTaskMutation,
        { loading: createLoading },
    ] = useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CREATE_TASK)

    const form = useFormik<CreateTaskFormType>({
        initialValues: { title: '' },
        onSubmit: async(formValues) => {
            await createTaskMutation({
                variables: {
                    input: {
                        cardId: card.id,
                        date: router.query.selectedDate as string,
                        title: formValues.title,
                    },
                },
            })
            .then(() => {
                form.resetForm({})
                refetch()
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
        <TasksCardProvider refetch={refetch}>
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
                <TasksCardTasks>
                    {tasksResult?.tasks.map((task) => {
                        return (
                            <Task
                                cardId={card.id}
                                key={task.id}
                                task={task}
                            />
                        )
                    })}
                </TasksCardTasks>
                <TasksCardForm onSubmit={form.handleSubmit}>
                    <TextField
                        fullWidth
                        maxLength={150}
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
        </TasksCardProvider>
    )
}
