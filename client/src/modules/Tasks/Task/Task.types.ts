import React from 'react'
import { DraggableProvided } from 'react-beautiful-dnd'

export type TaskProps =
    Pick<DraggableProvided, 'innerRef'>
    & React.HTMLAttributes<HTMLDivElement>
    & {
    task: TaskType,
    cardId: string,
}

export type TaskType = {
    id: string,
    title: string,
    note?: string | null,
    date: string,
    isCompleted: boolean,
    sequenceNumber: number,
}
