import dayjs from "dayjs"
import Link from "next/link"
import { useRouter } from "next/router"
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
    const { query } = useRouter()

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
                const isDayStartOfMonth = day.startOf('month').isSame(day)
                const isDaySelected = dayjs(dayjs(query.selectedDate as string).startOf("day")).isSame(day)

                return (
                    <React.Fragment key={day.format('DD dd')}>
                        {isDayStartOfMonth ? (
                            <MonthTitle>
                                {dayjs(day).format("MMMM")}
                            </MonthTitle>
                        ) : null}
                        <Link
                            as={`/dashboard/${dayjs(day).format("MM-DD-YYYY")}`}
                            href="/dashboard/[selectedDate]"
                        >
                            <DayListItem selected={isDaySelected}>
                                {day.format('DD dd')}
                            </DayListItem>
                        </Link>
                    </React.Fragment>
                )
            })}
            <DayListButton onClick={handleForwardClick}>
                <GoForwardIcon />
            </DayListButton>
        </TasksDayLisRoot>
    )
}
