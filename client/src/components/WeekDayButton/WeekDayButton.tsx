import _ from 'lodash'
import React, { useCallback } from 'react'
import { useToggle } from 'react-use'

import { DayCheckboxProps } from './WeekDayButton.types'

// Checkbox wrapper that can hold a week day as value
export const WeekDayButton: React.FC<DayCheckboxProps> = (props) => {
    const {
        weekDay,
        setSelectedWeekDays,
        selectedWeekDays,
    } = props

    const [isSelected, toggleIsSelected] = useToggle(selectedWeekDays.includes(weekDay.dayRruleNumber))

    // If week day exists in array, remove (uncheck), else add (check)
    const handleWeekDayCheck = useCallback(() => {
        toggleIsSelected()

        if (selectedWeekDays.includes(weekDay.dayRruleNumber)) {
            setSelectedWeekDays(_.filter(selectedWeekDays, (_weekDay) => _weekDay !== weekDay.dayRruleNumber))
        } else {
            setSelectedWeekDays([...selectedWeekDays, weekDay.dayRruleNumber])
        }
    }, [selectedWeekDays, toggleIsSelected, weekDay.dayRruleNumber, setSelectedWeekDays])
    return (
        <div
            className={'repeating-task__weekday' + (isSelected ? ' repeating-task__weekday--selected' : '')}
            onClick={handleWeekDayCheck}
        >
            {_.startCase(weekDay.dayString)}
        </div>
    )
}
