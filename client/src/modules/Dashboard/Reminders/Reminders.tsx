import { useQuery } from '@apollo/react-hooks'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { ErrorMessage } from '../../../components/ErrorMessage'
import { GET_REMINDERS_BY_DATE } from '../../../graphql/reminder/reminder'
import { getRemindersByDateResponse, getRemindersByDateVariables } from '../../../graphql/reminder/reminder.types'
import { ReminderDialog } from './ReminderDialog'
import { ReminderListItem } from './ReminderListItem'

export const Reminders: React.FC<{}> = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)
    const { username, selectedDate } = useSelector((state) => state.user)

    // Fetch reminders for selected date
    const { error, data } = useQuery<getRemindersByDateResponse, getRemindersByDateVariables>(GET_REMINDERS_BY_DATE, {
        variables: {
            username,
            selectedDate: moment.utc(selectedDate).format(),
        },
    })

    return (
        <div className="reminders">
            <div className="reminders__header">
                <p className="title">Reminders</p>
                <AddBoxOutlinedIcon className="reminders__icon" onClick={toggleDialog} />
            </div>
            <div>
                {data?.getRemindersByDate.map((reminder) => (
                    <ReminderListItem reminder={reminder} key={reminder.id} />
                ))}
                {error && <ErrorMessage error={'Something wen\'t wrong, please try again.'} />}
            </div>
            <ReminderDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>
    )
}
