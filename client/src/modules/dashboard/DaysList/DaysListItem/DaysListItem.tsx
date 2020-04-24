import React from 'react'
import { NavLink } from 'react-router-dom'

import { DaysListItemProps } from './DaysListItem.types'

export const DaysListItem: React.FunctionComponent<DaysListItemProps> = (props) => {
    const { day } = props

    return (
        <NavLink
            to={`/dashboard/${day.format('DoddddMMYYYY')}`}
            name={`/dashboard/${day.format('DoddddMMYYYY')}`}
            title={day.format('Do dddd MM YYYY')}
            className="days-sidebar__item"
            activeClassName="days-sidebar__item--active"
        >
            <p>{day.format('DD dd')}</p>
        </NavLink>
    )
}
