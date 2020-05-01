import AddRoundedIcon from '@material-ui/icons/AddRounded'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { TaskCardDialog } from './TaskCardDialog'
import { TaskCards } from './TaskCards'

export const TaskArea: React.FC<{}> = () => {
    const { selectedDate } = useSelector((state) => state.user)
    const [isDialogOpen, toggleDialog] = useToggle(false)

    // If overdue/upcoming display them, else display date
    const getDateTitle = () => {
        if (selectedDate === 'overdue' || selectedDate === 'upcoming') {
            return selectedDate
        }

        return moment(selectedDate).format('MMM Do YYYY - dddd')
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
            <TaskCards />
            <TaskCardDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>
    )
}
