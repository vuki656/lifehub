import {
    Dispatch,
    SetStateAction,
} from 'react'

import { RruleWeekDayType } from '../../util/helpers/variables'

export type DayCheckboxProps = {
    weekDay: RruleWeekDayType,
    setSelectedWeekDays: Dispatch<SetStateAction<number[]>>,
    selectedWeekDays: number[],
}
