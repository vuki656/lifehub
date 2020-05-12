import RRule, { RRuleSet } from 'rrule'

import { TaskType } from '../../../../graphql/task/task.types'

export type TaskDialogProps = {
    isDialogOpen: boolean,
    toggleDialog: () => void,
    task: TaskType,
    taskCardId: string,
    taskRrule: RRuleSet | RRule,
}
