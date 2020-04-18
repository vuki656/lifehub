import moment from 'moment'
import React from 'react'

import { DaysListItem } from './DaysListItem'

export const DaysList: React.FunctionComponent<{}> = () => {

    // Render 30 days from today
    const renderDays = React.useCallback(() => (
        [...new Array(30)].map((value, index) => {

            const nextDay = moment().add(index, 'days')
            return <DaysListItem day={nextDay} key={nextDay.format('x')} />
        })
    ), [])

    return (
        <div className="days-list">
            <p>OVERDUE</p>
            <p>test</p>
            <p>UPCOMING</p>
        </div>
    )
}
