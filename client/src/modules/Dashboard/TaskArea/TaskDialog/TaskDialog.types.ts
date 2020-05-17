import RRule, { RRuleSet } from 'rrule'

import { TaskType } from '../../../../graphql/task/task.types'

export type TaskDialogProps = {
    isDialogOpen: boolean,
    toggleDialog: () => void,
    task: TaskType,
    taskRRuleObj: RRuleSet | RRule,
    taskCardId: string,
}
