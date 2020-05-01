import { ReminderType } from '../../modules/Dashboard/Reminders/Reminder.types'

export type DeleteReminderResponse = {
    id: string,
}

export type UpdateReminderResponse = {
    id: string,
    username: string,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
}

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
    startDate: Date,
    endDate: Date,
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
    updateReminder: UpdateReminderResponse,
}

export type deleteReminderResponse = {
    deleteReminder: DeleteReminderResponse,
}

export type getRemindersByDateResponse = {
    getRemindersByDate: ReminderType[],
}
