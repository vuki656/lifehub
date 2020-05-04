import { Dispatch, SetStateAction } from 'react'
import { Weekday } from 'rrule'
import { rRuleWeekDayType } from '../../util/helpers/variables'

export type DayCheckboxProps = {
    weekDay: rRuleWeekDayType,
    setSelectedWeekDays: Dispatch<SetStateAction<Weekday[]>>,
    selectedWeekDays: Weekday[],
}
