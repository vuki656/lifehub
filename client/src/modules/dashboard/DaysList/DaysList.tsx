import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined'
import moment from 'moment'
import React from 'react'
import { NavLink } from 'react-router-dom'

import { DaysListItem } from './DaysListItem'

export const DaysList: React.FunctionComponent<{}> = () => {

    // Render 20 days from today
    const renderDays = React.useCallback(() => (
        [...new Array(20)].map((value, index) => {

            const nextDay = moment().add(index, 'days')
            return <DaysListItem day={nextDay} key={nextDay.format('DoddddMMYYYY')} />
        })
    ), [])

    return (
        <div className="days-sidebar">
            <NavLink
                to="/dashboard/overdue"
                name="overdue"
                title="overdue"
                className="days-sidebar__button"
                activeClassName="days-sidebar__item--active"
            >
                <ArrowBackOutlinedIcon />
                <p>Overdue</p>
            </NavLink>
            <div className="days-sidebar__days">
                {renderDays()}
            </div>
            <NavLink
                to="/dashboard/upcoming"
                name="upcoming"
                title="upcoming"
                className="days-sidebar__button"
                activeClassName="days-sidebar__item--active"
            >
                <p>Upcoming</p>
                <ArrowForwardOutlinedIcon />
            </NavLink>
        </div>
    )
}
