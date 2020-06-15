export type ReminderType = {
    id?: string,
    title: string,
    description?: string,
    startDate: string,
    endDate: string,
}

export type DeleteReminderResponse_OLD = {
    id: string,
}

export type UpdateReminderResponse_OLD = {
    id: string,
    username: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

// ** VARIABLES **
export type CreateReminderVariables = {
    username: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export type UpdateReminderVariables = {
    id: string,
    username: string,
    title: string,
    description: string,
    startDate: string,
    endDate: string,
}

export type DeleteReminderVariables = {
    id: string,
}

export type GetRemindersByDateVariables = {
    username: string,
    selectedDate: string | Date,
}

// ** RESPONSES **
export type UpdateReminderResponse = {
    updateReminder: UpdateReminderResponse_OLD,
}

export type DeleteReminderResponse = {
    deleteReminder: DeleteReminderResponse_OLD,
}

export type GetRemindersByDateResponse = {
    getRemindersByDate: ReminderType[],
}
