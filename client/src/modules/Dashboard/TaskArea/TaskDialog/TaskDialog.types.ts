import RRule, { RRuleSet } from 'rrule'

import { TaskType } from '../Task'

export type TaskDialogProps = {
    isDialogOpen: boolean,
    toggleDialog: () => void,
    task: TaskType,
    taskRRuleObj: RRuleSet | RRule,
    taskCardId: string,
}

export type TaskDialogFormTypes = {
    date: Date,
    startDate: Date,
    endDate: Date,
    title: string,
    note: string,
}
