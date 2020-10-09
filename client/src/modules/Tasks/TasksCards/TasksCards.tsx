import { useQuery } from "@apollo/client"
import * as React from 'react'

import { CARDS } from "../../../graphql/queries"
import { CardsQuery } from "../../../graphql/types"
import { useNotifications } from "../../../ui-kit/components/NotificationProvider"
import { TasksCard } from "../TasksCard"

import { TasksCardsRoot } from "./TasksCards.styles"

export const TasksCards: React.FunctionComponent = () => {
    const notifications = useNotifications()

    const { data: cardsResult } = useQuery<CardsQuery>(CARDS, {
        onError: () => {
            notifications.display(
                "Unable to fetch cards.",
                "error"
            )
        },
    })

    return (
        <TasksCardsRoot>
            {cardsResult?.cards.map((card) => {
                return (
                    <TasksCard
                        card={card}
                        key={card.id}
                    />
                )
            })}
        </TasksCardsRoot>
    )
}
