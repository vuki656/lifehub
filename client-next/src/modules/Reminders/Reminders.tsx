import { useQuery } from "@apollo/client"
import * as React from 'react'
import { REMINDERS } from "../../graphql/queries/Reminder"
import {
    RemindersQuery,
    RemindersQueryVariables,
    RemindersTimeSpanEnum,
} from "../../graphql/types"
import { Divider } from "../../ui-kit/components/Divider"
import {
    RemindersContent,
    RemindersHeader,
    RemindersRoot,
    RemindersTitle,
} from "./Reminders.styles"
import { RemindersAddDialog } from "./RemindersAddDialog"
import { RemindersCard } from "./RemindersCard"

export const Reminders: React.FunctionComponent = () => {
    const {
        data: remindersResult,
        refetch,
    } = useQuery<RemindersQuery, RemindersQueryVariables>(
        REMINDERS,
        { variables: { args: { timeSpan: RemindersTimeSpanEnum.All } } }
    )

    const handleSubmit = () => {
        refetch()
    }

    return (
        <RemindersRoot>
            <RemindersHeader>
                <RemindersTitle>
                    Reminders
                </RemindersTitle>
                <RemindersAddDialog onSubmit={handleSubmit} />
            </RemindersHeader>
            <Divider />
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
