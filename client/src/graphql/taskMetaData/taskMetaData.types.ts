export type TaskMetaDataType = {
    id: string,
    title: string,
    note: string,
    startDate: string,
    endDate: string,
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
    startDate: string | null,
    endDate: string | null,
    rrule: string | null,
    isRepeating: boolean,
    isHabit: boolean,
    taskCard: string,
}
