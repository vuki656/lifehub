import RRule, { RRuleSet } from 'rrule'

import { TaskType } from '../../../../graphql/task/task.types'

export type TaskDeleteDialogProps = {
    isDeleteDialogOpen: boolean,
    toggleDeleteDialog: () => void,
    taskCardId: string,
    task: TaskType,
    getRrule: () => RRule | RRuleSet,
}
