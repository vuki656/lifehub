export type ReminderType = {
    id?: string,
    title: string,
    description?: string,
    startDate: string,
    endDate: string,
}

export type DeleteReminderResponse = {
    id: string,
}

export type UpdateReminderResponse = {
    id: string,
    username: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

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

export type deleteReminderVariables = {
    id: string,
}

export type getRemindersByDateVariables = {
    username: string,
    selectedDate: string | Date,
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
