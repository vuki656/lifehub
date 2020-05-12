export type RepeatingTaskInstanceType = {
    id: string,
    isChecked: boolean,
    date: Date,
}

// ** VARIABLES **
export type updateRepeatingTaskInstanceVariables = {
    id: string,
    isChecked: boolean,
    date: Date,
}

export type deleteRepeatingTaskInstanceVariables = {
    repeatingTaskInstanceId: string,
    taskId: string,
    rruleStrWithUpdatedExclusions: string,
}

// ** RESPONSES **
export type updateRepeatingTaskInstanceResponse = {
    updateRepeatingTaskInstance: RepeatingTaskInstanceType,
}

export type deleteRepeatingTaskInstanceResponse = {
    deleteRepeatingTaskInstanceResponse: RepeatingTaskInstanceType,
}
