import React from "react"

export type RemindersCardProps = React.HTMLAttributes<HTMLDivElement> & {
    reminder: ReminderType,
}

export type ReminderType = {
    id: string,
    title: string,
    note?: string,
    dueDate: string,
}
