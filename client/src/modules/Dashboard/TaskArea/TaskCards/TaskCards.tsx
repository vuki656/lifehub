import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import { useSelector } from 'react-redux'

import { ErrorMessage } from '../../../../components/ErrorMessage'
import { GET_ALL_TASK_CARDS } from '../../../../graphql/taskCard/taskCard'
import { getAllTaskCardsResponse, getAllTaskCardsVariables } from '../../../../graphql/taskCard/taskCard.types'
import { TaskCard } from '../TaskCard'

export const TaskCards: React.FC<{}> = () => {
    const { username } = useSelector((state) => state.user)

    // Fetch all task cards
    const { error, data } = useQuery<getAllTaskCardsResponse, getAllTaskCardsVariables>(GET_ALL_TASK_CARDS, {
        variables: {
            username,
        },
    })

    return (
        <div className="task-cards">
            {data && data.getAllTaskCards.map((taskCard) => (
                <TaskCard taskCard={taskCard} key={taskCard.id} />
            ))}
            {error && <ErrorMessage error={'Something wen\'t wrong, please try again.'} />}

        </div>
    )
}
