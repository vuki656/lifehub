import _ from 'lodash'
import React, { useCallback } from 'react'
import { useToggle } from 'react-use'

import { DayCheckboxProps } from './DayCheckbox.types'

export const DayCheckbox: React.FC<DayCheckboxProps> = (props) => {
    const { weekDay, setSelectedWeekDays, selectedWeekDays } = props

    const [isChecked, toggleIsChecked] = useToggle(false)

    // If week day doesn't exist, add to list, else remove
    const handleWeekDayCheck = useCallback(() => {
        toggleIsChecked()

        if (selectedWeekDays.includes(weekDay.rrule)) {
            setSelectedWeekDays(_.filter(selectedWeekDays, (_weekDay) => _weekDay !== weekDay.rrule))
        } else {
            setSelectedWeekDays([...selectedWeekDays, weekDay.rrule])
        }

    }, [selectedWeekDays, toggleIsChecked, weekDay.rrule, setSelectedWeekDays])

    return (
        <div>
            <input
                type="checkbox"
                checked={isChecked}
                className="task__checkbox"
                onChange={handleWeekDayCheck}
            />
            <label
                htmlFor="task__checkbox"
                className="task__title"
            >
                {_.startCase(weekDay.dayString)}
            </label>
        </div>
    )
}
