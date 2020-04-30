import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined'
import moment from 'moment'
import React from 'react'
import { useDispatch } from 'react-redux'

import { NavLink } from 'react-router-dom'
import { setSelectedDate } from '../../../redux/actions/userActions'

export const DaysSidebar: React.FC<{}> = () => {
    const dispatch = useDispatch()

    // Render 20 days from today
    const renderDays = React.useCallback(() => (
        [...new Array(20)].map((value, index) => {
            const day = moment().add(index, 'days')

            return (
                <NavLink
                    to={`/dashboard/${day.format('DoddddMMYYYY')}`}
                    name={`/dashboard/${day.format('DoddddMMYYYY')}`}
                    title={day.format('Do dddd MM YYYY')}
                    className="days-sidebar__item"
                    activeClassName="days-sidebar__item--active"
                    key={day.format('DoddddMMYYYY')}
                    onClick={() => dispatch(setSelectedDate(moment(day).startOf('day')))}
                >
                    <p>{day.format('DD dd')}</p>
                </NavLink>
            )
        })
    ), [dispatch])

    return (
        <div className="days-sidebar">
            <NavLink
                to="/dashboard/overdue"
                name="overdue"
                title="overdue"
                className="days-sidebar__button"
                activeClassName="days-sidebar__item--active"
                onClick={() => dispatch(setSelectedDate('overdue'))}
            >
                <ArrowBackOutlinedIcon className="days-sidebar__icon" />
                <p className="days-sidebar__text">Overdue</p>
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
                onClick={() => dispatch(setSelectedDate('upcoming'))}
            >
                <p className="days-sidebar__text">Upcoming</p>
                <ArrowForwardOutlinedIcon className="days-sidebar__icon" />
            </NavLink>
        </div>
    )
}
