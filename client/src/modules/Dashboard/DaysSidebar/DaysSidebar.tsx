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

            const nextDay = moment().add(index, 'days')
            return (
                <NavLink
                    to={`/dashboard/${nextDay.format('DoddddMMYYYY')}`}
                    name={`/dashboard/${nextDay.format('DoddddMMYYYY')}`}
                    title={nextDay.format('Do dddd MM YYYY')}
                    className="days-sidebar__item"
                    activeClassName="days-sidebar__item--active"
                    key={nextDay.format('DoddddMMYYYY')}
                    onClick={() => dispatch(setSelectedDate(nextDay))}
                >
                    <p>{nextDay.format('DD dd')}</p>
                </NavLink>
            )
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
            >
                <p className="days-sidebar__text">Upcoming</p>
                <ArrowForwardOutlinedIcon className="days-sidebar__icon" />
            </NavLink>
        </div>
    )
}
