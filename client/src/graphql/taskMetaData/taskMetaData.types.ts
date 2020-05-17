export type TaskMetaDataType = {
    startDate: Date,
    endDate: Date,
    rrule: string,
    isRepeating: boolean,
    isHabit: boolean,
    nextRepeatingInstance: string,
}

// ** VARIABLES **
export type TaskMetaDataVariables = {
    startDate: Date,
    endDate: Date,
    rrule: string,
    isRepeating: boolean,
    isHabit: boolean,
}
