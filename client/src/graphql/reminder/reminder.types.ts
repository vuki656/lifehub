import { ReminderType } from '../../modules/Dashboard/Reminders/Reminder.types'

// ** VARIABLES **
export type createReminderVariables = {
    username: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export type updateReminderVariables = {
    id: string,
    username: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export type getRemindersByDateVariables = {
    username: string,
    selectedDate: string,
}

// ** RESPONSES **
export type createReminderResponse = {
    username: string,
    title: string,
    description: string,
    startDate: Date,
    Date: Date,
}

export type updateReminderResponse = {
    id: string,
    username: string,
    title: string,
    description: string,
    startDate: Date,
    Date: Date,
}

export type getRemindersByDateResponse = {
    getRemindersByDate: ReminderType[],
}
