import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined'
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined'
import dayjs from 'dayjs'
import React from 'react'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { setSelectedDate } from '../../../redux/actions/userActions'

export const DaysSidebar: React.FC = () => {
    const dispatch = useDispatch()

    // Render 20 days from today
    const renderDays = React.useCallback(() => (
        [...new Array(20)].map((value, index) => {
            const day = dayjs().add(index, 'day').startOf('day')

            return (
                <NavLink
                    to={`/dashboard/${day.valueOf()}`}
                    title={day.format('Do dddd MM YYYY')}
                    className="days-sidebar__item"
                    activeClassName="days-sidebar__item--active"
                    key={day.format('DoddddMMYYYY')}
                    onClick={() => dispatch(setSelectedDate(day.format('YYYY-MM-DD')))}
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
                title="overdue"
                className="days-sidebar__button"
                activeClassName="days-sidebar__item--active"
                onClick={() => dispatch(setSelectedDate(
                    dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DD'), // Yesterday => for getting overdue
                ))}
            >
                <ArrowBackOutlinedIcon className="days-sidebar__icon" />
                <p className="days-sidebar__text">Overdue</p>
            </NavLink>
            <div className="days-sidebar__days">
                {renderDays()}
            </div>
            <NavLink
                to="/dashboard/upcoming"
                title="upcoming"
                className="days-sidebar__button"
                activeClassName="days-sidebar__item--active"
                onClick={() => dispatch(setSelectedDate(
                    dayjs().add(20, 'day').startOf('day').format('YYYY-MM-DD'), // Day after day range => for getting upcoming
                ))}
            >
                <p className="days-sidebar__text">Upcoming</p>
                <ArrowForwardOutlinedIcon className="days-sidebar__icon" />
            </NavLink>
        </div>
    )
}
