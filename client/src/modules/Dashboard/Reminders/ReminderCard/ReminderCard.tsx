import AlarmOnRoundedIcon from '@material-ui/icons/AlarmOnRounded'
import InsertInvitationRoundedIcon from '@material-ui/icons/InsertInvitationRounded'
import moment from 'moment'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { ReminderDialog } from '../ReminderDialog'
import { ReminderListItemProps } from './ReminderCard.types'

export const ReminderCard: React.FC<ReminderListItemProps> = (props) => {
    const { reminder } = props

    const [isDialogOpen, toggleDialog] = useToggle(false)
    const selectedDate = useSelector((state) => state.user.selectedDate)

    // Calculate difference between selected date and reminder due date
    const getDateDifference = useCallback(({ endDate }) => {
        const dayDifference = moment(endDate).diff(selectedDate, 'days')

        // Return correct day, days or today string
        switch (dayDifference) {
            case 0:
                return `Today`
            case 1:
                return `${dayDifference} Day`
            default:
                return `${dayDifference} Days`
        }
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
                        {moment(reminder.endDate).format('Do MMM')}
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
