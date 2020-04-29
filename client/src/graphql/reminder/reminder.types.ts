import { ReminderType } from '../../modules/Dashboard/Reminders/Reminder.types'

// ** VARIABLES **
export type createReminderVariables = {
    username: string,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
}

export type updateReminderVariables = {
    id: string,
    username: string,
    title: string,
    description: string,
    startDate: number,
    endDate: number,
}

export type deleteReminderVariables = {
    id: string,
}

export type getRemindersByDateVariables = {
    username: string,
    selectedDate: string,
}

// ** RESPONSES **
export type createReminderResponse = {
    createReminder: ReminderType,
}

export type updateReminderResponse = {
    id: string,
    username: string,
    title: string,
    description: string,
    startDate: Date,
    Date: Date,
}

export type deleteReminderResponse = {
    id: string,
}

export type getRemindersByDateResponse = {
    getRemindersByDate: ReminderType[],
}
