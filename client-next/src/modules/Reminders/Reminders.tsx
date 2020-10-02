import { useQuery } from "@apollo/client"
import * as React from 'react'

import { REMINDERS } from "../../graphql/queries"
import {
    RemindersQuery,
    RemindersQueryVariables,
    RemindersTimeSpanEnum,
} from "../../graphql/types"
import { NotificationProvider } from "../../ui-kit/components/NotificationProvider"
import { useNotifications } from "../../ui-kit/components/NotificationProvider/useNotifications"

import {
    RemindersContent,
    RemindersHeader,
    RemindersRoot,
    RemindersTitle,
} from "./Reminders.styles"
import { RemindersAddDialog } from "./RemindersAddDialog"
import { RemindersCard } from "./RemindersCard"

export const Reminders: React.FunctionComponent = () => {
    const { display } = useNotifications()

    const {
        data: remindersResult,
        refetch,
    } = useQuery<RemindersQuery, RemindersQueryVariables>(
        REMINDERS,
        {
            onError: () => {
                display(
                    "Unable to fetch reminders.",
                    "error"
                )
            },
            variables: { args: { timeSpan: RemindersTimeSpanEnum.All } },
        },
    )

    const handleSubmit = () => {
        refetch()
    }

    return (
        <RemindersRoot>
            <NotificationProvider />
            <RemindersHeader>
                <RemindersTitle>
                    Reminders
                </RemindersTitle>
                <RemindersAddDialog onSubmit={handleSubmit} />
            </RemindersHeader>
            <RemindersContent>
                {remindersResult?.reminders.map((reminder) => {
                    return (
                        <RemindersCard
                            key={reminder.id}
                            reminder={reminder}
                        />
                    )
                })}
            </RemindersContent>
        </RemindersRoot>
    )
}
