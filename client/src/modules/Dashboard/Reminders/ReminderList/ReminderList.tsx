import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'

import { ErrorMessage } from '../../../../components/ErrorMessage'
import { GET_REMINDERS_BY_DATE } from '../../../../graphql/reminder/reminder'
import { getRemindersByDateResponse, getRemindersByDateVariables } from '../../../../graphql/reminder/reminder.types'
import { ReminderListItem } from '../ReminderListItem'

export const ReminderList: React.FC<{}> = () => {
    const { username, selectedDate } = useSelector((state) => state.user)

    // Fetch reminders for selected date
    const { error, data } = useQuery<getRemindersByDateResponse, getRemindersByDateVariables>(GET_REMINDERS_BY_DATE, {
        variables: {
            username,
            selectedDate: moment.utc(selectedDate).format(),
        },
    })

    return (
        <div>
            {data?.getRemindersByDate.map((reminder) => (
                <ReminderListItem reminder={reminder} key={reminder.id} />
            ))}
            {error && <ErrorMessage error={'Something wen\'t wrong, please try again.'} />}
        </div>
    )
}
