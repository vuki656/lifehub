import { Dispatch, SetStateAction } from 'react'
import { Weekday } from 'rrule'
import { RruleWeekDayType } from '../../util/helpers/variables'

export type DayCheckboxProps = {
    weekDay: RruleWeekDayType,
    setSelectedWeekDays: Dispatch<SetStateAction<Weekday[]>>,
    selectedWeekDays: number[],
}
