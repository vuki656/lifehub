import { useQuery } from '@apollo/react-hooks'
import AddRoundedIcon from '@material-ui/icons/AddRounded'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { Message } from '../../../components/Message'
import { CARDS } from '../../../graphql/queries/card'
import {
    CardsQuery,
    CardsQueryVariables,
} from '../../../graphql/types'
import { UserStateType } from '../../../redux/reducers/user'
import { renderLoaders } from '../../../util/helpers/renderLoaders'

import { TaskCard } from './TaskCard'
import { TaskCardDialog } from './TaskCardDialog'
import { TaskCardLoader } from './TaskCardLoader'

dayjs.extend(advancedFormat)

export const TaskArea: React.FC = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)

    const { selectedDate } = useSelector((state: UserStateType) => state)

    // Fetch all task cards
    const {
        error,
        data,
        loading,
    } = useQuery<CardsQuery, CardsQueryVariables>(
        CARDS,
        { variables: { cardTasksArgs: { date: selectedDate } } },
    )

    // If overdue/upcoming display word, else display date
    const getDateTitle = () => {
        if (selectedDate === 'overdue' || selectedDate === 'upcoming') {
            return selectedDate
        }

        return dayjs(selectedDate).format('MMM Do YYYY - dddd')
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
                {loading
                    ? (renderLoaders(3, <TaskCardLoader />))
                    : (
                        <>
                            {data?.cards.map((card) => (
                                <TaskCard taskCard={card} key={card.id} />
                            ))}
                            {error && <Message message={'Something wen\'t wrong, please try again.'} type="error" />}
                        </>
                    )}
            </div>
            <TaskCardDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>

    )
}
