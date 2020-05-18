export type TaskMetaDataType = {
    id: string,
    title: string,
    note: string,
    startDate: Date,
    endDate: Date,
    rrule: string,
    isRepeating: boolean,
    isHabit: boolean,
    nextRepeatingInstance: string,
}

// ** VARIABLES **
export type TaskMetaDataVariables = {
    id: string,
    title: string,
    note: string,
    startDate: Date,
    endDate: Date,
    rrule: string,
    isRepeating: boolean,
    isHabit: boolean,
}
