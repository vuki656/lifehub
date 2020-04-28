import { useQuery } from '@apollo/react-hooks'
import moment from 'moment'
import React from 'react'
import { useSelector } from 'react-redux'

import { GET_REMINDERS_BY_DATE } from '../../../../graphql/reminder/reminder'

export const ReminderList: React.FC<{}> = () => {
    const { username, selectedDate } = useSelector((state) => state.user)

    const { loading, error, data } = useQuery(GET_REMINDERS_BY_DATE, {
        variables: { username, selectedDate: moment.utc(selectedDate).format() },
    })

    return (
        <div>
            {console.log(data)}
            {console.log(error)}
            <p>Test</p>
        </div>
    )
}
