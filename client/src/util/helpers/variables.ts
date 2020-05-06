import { RRule, Weekday } from 'rrule'

export type RruleWeekDayType = {
    dayString: string,
    rrule: Weekday,
}

export const rruleWeekDaysArr: RruleWeekDayType[] = [
    {
        dayString: 'mo',
        rrule: RRule.MO,
    },
    {
        dayString: 'tu',
        rrule: RRule.TU,
    },
    {
        dayString: 'we',
        rrule: RRule.WE,
    },
    {
        dayString: 'th',
        rrule: RRule.TH,
    },
    {
        dayString: 'fr',
        rrule: RRule.FR,
    },
    {
        dayString: 'sa',
        rrule: RRule.SA,
    },
    {
        dayString: 'su',
        rrule: RRule.SU,
    },
]
