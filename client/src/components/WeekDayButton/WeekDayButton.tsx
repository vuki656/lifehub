import _ from 'lodash'
import React, { useCallback } from 'react'
import { useToggle } from 'react-use'

import { DayCheckboxProps } from './WeekDayButton.types'

// Checkbox wrapper that can hold a week day as value
export const WeekDayButton: React.FC<DayCheckboxProps> = (props) => {
    const { weekDay, setSelectedWeekDays, selectedWeekDays } = props

    const [isSelected, toggleIsSelected] = useToggle(selectedWeekDays.includes(weekDay))

    // If week day exists in array, remove (uncheck), else add (check)
    const handleWeekDayCheck = useCallback(() => {
        toggleIsSelected()

        if (selectedWeekDays.includes(weekDay.rrule)) {
            setSelectedWeekDays(_.filter(selectedWeekDays, (_weekDay) => _weekDay !== weekDay.rrule))
        } else {
            setSelectedWeekDays([...selectedWeekDays, weekDay.rrule])
        }

    }, [selectedWeekDays, toggleIsSelected, weekDay.rrule, setSelectedWeekDays])

    return (
        <div
            className={'repeating-task__weekday' + (isSelected ? ' repeating-task__weekday--selected' : '')}
            onClick={handleWeekDayCheck}
        >
            {_.startCase(weekDay.dayString)}
        </div>
    )
}
