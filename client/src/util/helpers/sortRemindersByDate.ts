import { ReminderType } from '../../graphql/reminder/reminder.types'

// Take a list of reminders and return sorted list
export const sortRemindersByDate = (arrayToSort: ReminderType[]) => {
    return arrayToSort.sort((a, b) => {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    })
}
