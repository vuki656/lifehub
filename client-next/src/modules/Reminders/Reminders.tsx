import * as React from 'react'
import {
    RemindersHeader,
    RemindersRoot,
    RemindersTitle,
} from "./Reminders.styles"
import { RemindersAddDialog } from "./RemindersAddDialog"

export const Reminders: React.FunctionComponent = () => {

    return (
        <RemindersRoot>
            <RemindersHeader>
                <RemindersTitle>
                    Reminders
                </RemindersTitle>
                <RemindersAddDialog />
            </RemindersHeader>
        </RemindersRoot>
    )
}
