import {
    Arg,
    Authorized,
    Mutation,
    Resolver,
} from 'type-graphql'

import { TaskService } from './Task.service'
import {
    CreateTaskInput,
    DeleteTaskInput,
    EditTaskInput,
} from './mutations/inputs'
import {
    CreateTaskPayload,
    DeleteTaskPayload,
    EditTaskPayload,
} from './mutations/payloads'
import { TaskType } from './types'

@Resolver(() => TaskType)
export class TaskResolver {

    constructor(
        private readonly service: TaskService,
    ) {
    }

    @Authorized()
    @Mutation(() => CreateTaskPayload)
    public async createTask(
        @Arg('input') input: CreateTaskInput,
    ): Promise<CreateTaskPayload> {
        return this.service.create(input)
    }

    @Authorized()
    @Mutation(() => EditTaskPayload)
    public async editTask(
        @Arg('input') input: EditTaskInput,
    ): Promise<EditTaskPayload> {
        return this.service.edit(input)
    }

    @Authorized()
    @Mutation(() => DeleteTaskPayload)
    public async deleteTask(
        @Arg('input') input: DeleteTaskInput,
    ): Promise<DeleteTaskPayload> {
        return this.service.delete(input)
    }

}
