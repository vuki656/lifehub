import {
    Arg,
    Authorized,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql'

import { TaskService } from './Task.service'
import {
    TaskArgs,
    TasksArgs,
} from './args'
import {
    CreateTaskInput,
    DeleteTaskInput,
    EditTaskInput,
    ToggleTaskInput,
} from './mutations/inputs'
import {
    CreateTaskPayload,
    DeleteTaskPayload,
    EditTaskPayload,
    ToggleTaskPayload,
} from './mutations/payloads'
import { TaskType } from './types'

@Resolver(() => TaskType)
export class TaskResolver {

    constructor(
        private readonly service: TaskService,
    ) {
    }

    @Authorized()
    @Query(() => TaskType)
    public async task(
        @Arg('args') args: TaskArgs,
    ): Promise<TaskType> {
        return this.service.findOne(args)
    }

    @Authorized()
    @Query(() => [TaskType])
    public async tasks(
        @Arg('args') args: TasksArgs,
    ): Promise<TaskType[]> {
        return this.service.findByDateAndCard(args)
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

    @Authorized()
    @Mutation(() => ToggleTaskPayload)
    public async toggleTask(
        @Arg('input') input: ToggleTaskInput,
    ): Promise<ToggleTaskPayload> {
        return this.service.toggle(input)
    }

}
