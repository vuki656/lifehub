import { useQuery } from '@apollo/react-hooks'
import AlarmOffSharpIcon from '@material-ui/icons/AlarmOffSharp'
import AlarmOnSharpIcon from '@material-ui/icons/AlarmOnSharp'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'

import { GET_REMINDERS_BY_DATE } from '../../../../graphql/reminder/reminder'
import { getRemindersByDateResponse, getRemindersByDateVariables } from '../../../../graphql/reminder/reminder.types'

export const ReminderList: React.FC<{}> = () => {
    const { username, selectedDate } = useSelector((state) => state.user)

    const { loading, error, data } = useQuery<getRemindersByDateResponse, getRemindersByDateVariables>(GET_REMINDERS_BY_DATE, {
        variables: { username, selectedDate: moment.utc(selectedDate).format() },
    })

    return (
        <div>
            {data && data?.getRemindersByDate.map((reminder) => (
                <div className="reminder-card" key={reminder.title}>
                    <p className="reminder-card__title">{reminder.title}</p>
                    <p className="reminder-card__description">{reminder.description}</p>
                    <p className="reminder-card__date-wrapper">
                        <span className="reminder-card__tag reminder-card__tag--start">
                            <AlarmOnSharpIcon className="reminder-card__icon" />
                            <span className="reminder-card__text">
                                Start: {moment.unix(reminder.startDate / 1000).local().format('Do MMM')}
                            </span>
                        </span>
                        {' '}
                        <span className="reminder-card__tag reminder-card__tag--end">
                            <AlarmOffSharpIcon className="reminder-card__icon" />
                               <span className="reminder-card__text">
                                End: {moment.unix(reminder.endDate / 1000).local().format('Do MMM')}
                                </span>
                        </span>
                    </p>
                </div>
            ))}
        </div>
    )
}
