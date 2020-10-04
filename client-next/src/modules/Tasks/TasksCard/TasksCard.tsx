import * as React from 'react'

import { TasksCardDeleteDialog } from "../TasksCardDeleteDialog"
import { TasksCardEditDialog } from "../TasksCardEditDialog"

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
                    <TasksCardEditDialog card={card} />
                    <TasksCardDeleteDialog card={card} />
                </TasksCardActions>
            </TasksCardHeader>
        </TasksCardRoot>
    )
}
