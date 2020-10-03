import { useQuery } from "@apollo/client"
import * as React from 'react'
import { useToggle } from "react-use"

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
import {
    RemindersCard,
    ReminderType,
} from "./RemindersCard"
import { RemindersEditDialog } from "./RemindersEditDialog"

export const Reminders: React.FunctionComponent = () => {
    const notifications = useNotifications()

    const [
        isDialogOpen,
        toggleDialog,
    ] = useToggle(false)

    const selectedReminder = React.useRef<ReminderType | null>(null)

    const {
        data: remindersResult,
        refetch,
    } = useQuery<RemindersQuery, RemindersQueryVariables>(
        REMINDERS,
        {
            onError: () => {
                notifications.display(
                    "Unable to fetch reminders.",
                    "error"
                )
            },
            variables: { args: { timeSpan: RemindersTimeSpanEnum.All } },
        },
    )

    const handleReminderClick = (reminder: ReminderType) => () => {
        selectedReminder.current = reminder
        toggleDialog()
    }

    const handleSubmit = () => {
        refetch()
    }

    return (
        <>
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
                                onClick={handleReminderClick(reminder)}
                                reminder={reminder}
                            />
                        )
                    })}
                </RemindersContent>
            </RemindersRoot>
            {selectedReminder.current ? (
                <RemindersEditDialog
                    isDialogOpen={isDialogOpen}
                    onSubmit={handleSubmit}
                    reminder={selectedReminder.current}
                    toggleDialog={toggleDialog}
                />
            ) : null}
        </>
    )
}
