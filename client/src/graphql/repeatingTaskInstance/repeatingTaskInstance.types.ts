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

// ** RESPONSES **
export type updateRepeatingTaskInstanceResponse = {
    updateRepeatingTaskInstance: RepeatingTaskInstanceType,
}
