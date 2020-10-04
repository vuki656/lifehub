import * as React from 'react'

import { TasksCardDeleteDialog } from "../TasksCardDeleteDialog"

import {
    TasksCardActions,
    TasksCardHeader,
    TasksCardRoot,
    TasksCardTitle,
} from "./TasksCard.styles"
import { TasksCardProps } from "./TasksCard.types"

export const TasksCard: React.FunctionComponent<TasksCardProps> = (props) => {
    const { card } = props

    return (
        <TasksCardRoot>
            <TasksCardHeader>
                <TasksCardTitle>
                    {card.name}
                </TasksCardTitle>
                <TasksCardActions>
                    <TasksCardDeleteDialog card={card} />
                </TasksCardActions>
            </TasksCardHeader>
        </TasksCardRoot>
    )
}
