import { useQuery } from '@apollo/react-hooks'
import AddRoundedIcon from '@material-ui/icons/AddRounded'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { ErrorMessage } from '../../../components/ErrorMessage'
import { GET_REMINDERS_BY_DATE } from '../../../graphql/reminder/reminder'
import { getRemindersByDateResponse, getRemindersByDateVariables } from '../../../graphql/reminder/reminder.types'
import { renderLoaders } from '../../../util/helpers/renderLoaders'
import { sortRemindersByDate } from '../../../util/helpers/sortRemindersByDate'
import { ReminderCard } from './ReminderCard'
import { ReminderCardLoader } from './ReminderCardLoader'
import { ReminderDialog } from './ReminderDialog'

export const Reminders: React.FC<{}> = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)
    const { username, selectedDate } = useSelector((state) => state.user)

    // Fetch reminders for selected date
    const { error, data, loading } = useQuery<getRemindersByDateResponse, getRemindersByDateVariables>(GET_REMINDERS_BY_DATE, {
        variables: {
            username,
            selectedDate,
        },
    })

    // Sort reminders by date ascending then render
    const renderReminderCards = () => {
        if (data?.getRemindersByDate.length === 0) {
            return (
                <p className="info-message">
                    No reminders <span role="img" aria-label="calendar">📅</span>
                </p>
            )
        }

        const sortedReminders = data && sortRemindersByDate(data?.getRemindersByDate)

        return sortedReminders?.map((reminder) => (
            <ReminderCard reminder={reminder} key={reminder.id} />
        ))
    }

    return (
        <div className="reminders">
            <div className="reminders__header">
                <p className="title">Reminders</p>
                <div className="reminders__button button--secondary">
                    <p className="reminders__header-text" onClick={toggleDialog}>
                        Add <AddRoundedIcon className="reminders__icon" />
                    </p>
                </div>
            </div>
            {loading
                ? (renderLoaders(4, <ReminderCardLoader />))
                : (
                    <>
                        {renderReminderCards()}
                        {error && <ErrorMessage error={'Something wen\'t wrong, please try again.'} />}
                    </>
                )}
            <ReminderDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>
    )
}
