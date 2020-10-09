import React from "react"

export type TaskProps = React.HTMLAttributes<HTMLDivElement> & {
    task: TaskType,
    cardId: string,
}

export type TaskType = {
    id: string,
    title: string,
    note?: string | null,
    date: string,
    isCompleted: boolean,
}
