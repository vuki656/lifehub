import { useQuery } from '@apollo/react-hooks'
import AlarmOnRoundedIcon from '@material-ui/icons/AlarmOnRounded'
import InsertInvitationRoundedIcon from '@material-ui/icons/InsertInvitationRounded'
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

    const getDatDifference = (reminder) => {
        const start = moment.unix(reminder.startDate / 1000).local()
        const end = moment.unix(reminder.endDate / 1000).local()

        return end.diff(start, 'days')
    }

    return (
        <div>
            {data && data?.getRemindersByDate.map((reminder) => (
                <div className="reminder-card" key={reminder.title}>
                    <p className="reminder-card__title">{reminder.title}</p>
                    <p className="reminder-card__description">{reminder.description}</p>
                    <p className="reminder-card__date-wrapper">
                        <span className="reminder-card__tag">
                            <AlarmOnRoundedIcon className="reminder-card__icon" />
                            <span className="reminder-card__text">
                                {moment.unix(reminder.endDate / 1000).local().format('Do MMM')}
                            </span>
                        </span>
                        <span className="reminder-card__tag reminder-card__tag--last">
                            <InsertInvitationRoundedIcon className="reminder-card__icon" />
                            <span className="reminder-card__text">
                                {getDatDifference(reminder)} Days
                            </span>
                        </span>
                    </p>
                </div>
            ))}
        </div>
    )
}
