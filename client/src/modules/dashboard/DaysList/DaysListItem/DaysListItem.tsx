import React from 'react'

import { DaysListItemProps } from './DaysListItem.types'

export const DaysListItem: React.FunctionComponent<DaysListItemProps> = (props) => {
    const { day } = props

    return (
        <p className="days-list__item">{day.format('DD dd')}</p>
    )
}
