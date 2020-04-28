import AlarmOnRoundedIcon from '@material-ui/icons/AlarmOnRounded'
import InsertInvitationRoundedIcon from '@material-ui/icons/InsertInvitationRounded'
import moment from 'moment'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { ReminderDialog } from '../ReminderDialog'
import { ReminderListItemProps } from './ReminderListItem.types'

export const ReminderListItem: React.FC<ReminderListItemProps> = (props) => {
    const { reminder } = props

    const [isDialogOpen, toggleDialog] = useToggle(false)
    const selectedDate = useSelector((state) => state.user.selectedDate)

    // Calculate difference between selected date and reminder due date
    const getDateDifference = useCallback((reminder) => {
        const start = moment(selectedDate)
        const end = moment.unix(reminder.endDate / 1000).local()
        const result = end.diff(start, 'days')

        return result === 0 ? 'Today' : `${result} Days`
    }, [selectedDate])

    // Disable onClick if dialog open so its not closed on click anywhere in dialog
    const handleCardClick = useCallback(() => {
        !isDialogOpen && toggleDialog()
    }, [isDialogOpen, toggleDialog])

    return (
        <div
            className="reminder-card"
            key={reminder.id}
            onClick={handleCardClick}
        >
            <p className="reminder-card__title">{reminder.title}</p>
            <p className="reminder-card__description">{reminder.description}</p>
            <p className="reminder-card__date-wrapper">
                <span className="reminder-card__tag">
                    <InsertInvitationRoundedIcon className="reminder-card__icon" />
                    <span className="reminder-card__text">
                        {moment.unix(reminder.endDate / 1000).local().format('Do MMM')}
                    </span>
                </span>
                <span className="reminder-card__tag reminder-card__tag--last">
                    <AlarmOnRoundedIcon className="reminder-card__icon" />
                    <span className="reminder-card__text">
                        {getDateDifference(reminder)}
                    </span>
                </span>
            </p>
            <ReminderDialog
                toggleDialog={toggleDialog}
                isDialogOpen={isDialogOpen}
                reminder={reminder}
            />
        </div>
    )
}