import { useQuery } from '@apollo/react-hooks'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { ErrorMessage } from '../../../components/ErrorMessage'
import { GET_REMINDERS_BY_DATE } from '../../../graphql/reminder/reminder'
import { getRemindersByDateResponse, getRemindersByDateVariables } from '../../../graphql/reminder/reminder.types'
import { sortRemindersByDate } from '../../../util/helpers/sortRemindersByDate'
import { ReminderType } from './Reminder.types'
import { ReminderDialog } from './ReminderDialog'
import { ReminderItem } from './ReminderItem'

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

    // Sort reminders by date starting at latest then render
    const renderReminderItems = () => {
        const sortedReminders: ReminderType[] = sortRemindersByDate(data?.getRemindersByDate)

        return sortedReminders?.map((reminder) => (
            <ReminderItem reminder={reminder} key={reminder.id} />
        ))
    }

    return (
        <div className="reminders">
            <div className="reminders__header">
                <p className="title">Reminders</p>
                <AddBoxOutlinedIcon className="reminders__icon" onClick={toggleDialog} />
            </div>
            {!loading && (
                <div>
                    {renderReminderItems()}
                    {error && <ErrorMessage error={'Something wen\'t wrong, please try again.'} />}
                </div>
            )}
            <ReminderDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>
    )
}
