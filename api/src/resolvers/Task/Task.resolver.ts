import {
    Arg,
    Authorized,
    Mutation,
    Resolver,
} from 'type-graphql'

import { TaskService } from './Task.service'
import { CreateTaskInput } from './mutations/inputs'
import { CreateTaskPayload } from './mutations/payloads/CreateTask.payload'
import { TaskType } from './types'

@Resolver(() => TaskType)
export class TaskResolver {

    constructor(
        private readonly service: TaskService,
    ) {
    }

    @Authorized()
    @Mutation(() => CreateTaskPayload)
    public async createCard(
        @Arg('input') input: CreateTaskInput,
    ): Promise<CreateTaskPayload> {
        return this.service.create(input)
    }

}
