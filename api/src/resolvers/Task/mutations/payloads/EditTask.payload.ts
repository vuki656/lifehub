import {
    Field,
    ObjectType,
} from 'type-graphql'

import { TaskType } from '../../types'

@ObjectType()
export class EditTaskPayload {

    @Field()
    public task: TaskType

    constructor(task: TaskType) {
        this.task = task
    }

}
