import { RRule, Weekday } from 'rrule'

export type rRuleWeekDayType = {
    dayString: string,
    rrule: Weekday,
}

export const rruleWeekDaysArr: rRuleWeekDayType[] = [
    {
        dayString: 'monday',
        rrule: RRule.MO,
    },
    {
        dayString: 'tuesday',
        rrule: RRule.TU,
    },
    {
        dayString: 'wednesday',
        rrule: RRule.WE,
    },
    {
        dayString: 'thursday',
        rrule: RRule.TH,
    },
    {
        dayString: 'friday',
        rrule: RRule.FR,
    },
    {
        dayString: 'saturday',
        rrule: RRule.SA,
    },
    {
        dayString: 'sunday',
        rrule: RRule.SU,
    },
]
