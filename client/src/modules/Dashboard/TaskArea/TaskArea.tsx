import AddRoundedIcon from '@material-ui/icons/AddRounded'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { TaskCards } from './TaskCards'
import { TaskDialog } from './TaskDialog'

export const TaskArea: React.FC<{}> = () => {
    const { username, selectedDate } = useSelector((state) => state.user)
    const [isDialogOpen, toggleDialog] = useToggle(false)

    return (
        <div className="task-area">
            <div className="task-area__header">
                <p className="title">{moment(selectedDate).format('MMM Do YYYY - dddd')}</p>
                <div className="task-area__button button--primary">
                    <p className="task-area__header-text" onClick={toggleDialog}>
                        New Task <AddRoundedIcon className="task-area__icon" />
                    </p>
                </div>
            </div>
            <TaskCards />
            <TaskDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>
    )
}
