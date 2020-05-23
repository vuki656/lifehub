import { useQuery } from '@apollo/react-hooks'
import AddRoundedIcon from '@material-ui/icons/AddRounded'
import dayjs from 'dayjs'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { ErrorMessage } from '../../../components/ErrorMessage'
import { GET_ALL_TASK_CARDS } from '../../../graphql/taskCard/taskCard'
import { getAllTaskCardsResponse, getAllTaskCardsVariables } from '../../../graphql/taskCard/taskCard.types'
import { renderLoaders } from '../../../util/helpers/renderLoaders'
import { TaskCard } from './TaskCard'
import { TaskCardDialog } from './TaskCardDialog'
import { TaskCardLoader } from './TaskCardLoader'

export const TaskArea: React.FC<{}> = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)

    const { username, selectedDate, tasksLoadingStatus } = useSelector((state) => state.user)

    // Fetch all task cards
    const { error, data } = useQuery<getAllTaskCardsResponse, getAllTaskCardsVariables>(GET_ALL_TASK_CARDS, {
        variables: {
            username,
        },
    })

    // If overdue/upcoming display word, else display date
    const getDateTitle = () => {
        if (selectedDate === 'overdue' || selectedDate === 'upcoming') {
            return selectedDate
        }

        return dayjs(selectedDate).format('MMM D YYYY - dddd')
    }

    return (
        <div className="task-area">
            <div className="task-area__header">
                <p className="title">{getDateTitle()}</p>
                <div className="task-area__button button--primary">
                    <p className="task-area__header-text" onClick={toggleDialog}>
                        New Task Card<AddRoundedIcon className="task-area__icon" />
                    </p>
                </div>
            </div>
            <div className="task-cards">
                {tasksLoadingStatus
                    ? (renderLoaders(3, <TaskCardLoader />))
                    : (
                        <>
                            {data && data.getAllTaskCards.map((taskCard) => (
                                <TaskCard taskCard={taskCard} key={taskCard.id} />
                            ))}
                            {error && <ErrorMessage error={'Something wen\'t wrong, please try again.'} />}
                        </>
                    )}
            </div>
            <TaskCardDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>

    )
}
