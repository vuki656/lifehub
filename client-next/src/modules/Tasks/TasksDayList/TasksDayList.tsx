import dayjs from "dayjs"
import * as React from 'react'

import {
    DayListButton,
    DayListItem,
    GoBackwardIcon,
    GoForwardIcon,
    MonthTitle,
    TasksDayLisRoot,
} from "./TasksDayList.styles"

export const TasksDayList: React.FunctionComponent = () => {
    // List of 20 days (dayjs objects) starting from today
    const initialDayList = [...new Array(20)].map((value, index) => {
        return dayjs()
        .add(index, 'day')
        .startOf('day')
    })

    const [
        daysInFocus,
        setDaysInFocus,
    ] = React.useState(initialDayList)

    const handleBackwardClick = () => {
        const previousDay = daysInFocus[0].subtract(1, "day")
        const updatedList = [...daysInFocus]

        updatedList.pop()
        updatedList.unshift(previousDay)

        setDaysInFocus(updatedList)
    }

    const handleForwardClick = () => {
        const nextDay = daysInFocus[daysInFocus.length - 1].add(1, "day")
        const updatedList = [...daysInFocus]

        updatedList.shift()
        updatedList.push(nextDay)

        setDaysInFocus(updatedList)
    }

    return (
        <TasksDayLisRoot>
            <DayListButton onClick={handleBackwardClick}>
                <GoBackwardIcon />
            </DayListButton>
            {daysInFocus.map((day) => {
                const startOfMonth = dayjs(day).startOf('month')
                const isDayStartOfMonth = dayjs(startOfMonth).isSame(day)

                return (
                    <React.Fragment key={day.format('DD dd')}>
                        {isDayStartOfMonth ? (
                            <MonthTitle>
                                {dayjs(day).format("MMMM")}
                            </MonthTitle>
                        ) : null}
                        <DayListItem>
                            {day.format('DD dd')}
                        </DayListItem>
                    </React.Fragment>
                )
            })}
            <DayListButton onClick={handleForwardClick}>
                <GoForwardIcon />
            </DayListButton>
        </TasksDayLisRoot>
    )
}
