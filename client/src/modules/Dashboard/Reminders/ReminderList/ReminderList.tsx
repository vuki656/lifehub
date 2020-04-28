import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'

import { GET_REMINDERS_BY_DATE } from '../../../../graphql/reminder/reminder'
import { getRemindersByDateResponse, getRemindersByDateVariables } from '../../../../graphql/reminder/reminder.types'

export const ReminderList: React.FC<{}> = () => {
    const { username, selectedDate } = useSelector((state) => state.user)

    // todo: date timestamps are off by couple thousand years, response date needs to be parsed somehow
    const { loading, error, data } = useQuery<getRemindersByDateResponse, getRemindersByDateVariables>(GET_REMINDERS_BY_DATE, {
        variables: { username, selectedDate: moment.utc(selectedDate).format() },
    })

    return (
        <div>
            {data && data?.getRemindersByDate.map((reminder) => (
                <div key={reminder.title}>
                    <p>{reminder.title}</p>
                    <p>{reminder.description}</p>
                    {console.log(reminder.startDate)}
                    <p>{moment.unix(reminder.startDate).format('DD/MM/YYYY')}</p>
                    <p>{moment.unix(reminder.endDate).format('DD/MM/YYYY')}</p>
                </div>
            ))}
        </div>
    )
}
