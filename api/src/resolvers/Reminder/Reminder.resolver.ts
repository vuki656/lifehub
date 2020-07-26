import {
    Arg,
    Authorized,
    Ctx,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql'

import { ContextType } from '../../../global/types/context.type'
import {
    CreateReminderInput,
    EditReminderInput,
} from './mutations/input'
import {
    CreateReminderPayload,
    DeleteReminderPayload,
    EditReminderPayload,
} from './mutations/payloads'

import { ReminderService } from './Reminder.service'
import { ReminderType } from './Reminder.type'

@Resolver(() => ReminderType)
export class ReminderResolver {

    constructor(
        private readonly service: ReminderService,
    ) {
    }

    @Authorized()
    @Query(() => ReminderType, { nullable: true })
    public async reminder(
        @Arg('id') id: string,
    ): Promise<ReminderType | null> {
        return this.service.findOne(id)
    }

    @Authorized()
    @Query(() => [ReminderType])
    public async remindersByDate(
        @Arg('date') date: Date,
        @Ctx() context: ContextType,
    ): Promise<ReminderType[]> {
        return this.service.findByDate(date, context)
    }

    @Authorized()
    @Mutation(() => CreateReminderPayload)
    public async createReminder(
        @Arg('input') input: CreateReminderInput,
        @Ctx() context: ContextType,
    ): Promise<CreateReminderPayload> {
        return this.service.create(input, context)
    }

    @Authorized()
    @Mutation(() => EditReminderPayload)
    public async editReminder(
        @Arg('input') input: EditReminderInput,
    ): Promise<EditReminderPayload> {
        return this.service.edit(input)
    }

    @Authorized()
    @Mutation(() => DeleteReminderPayload)
    public async deleteReminder(
        @Arg('id') id: string,
    ): Promise<DeleteReminderPayload> {
        return this.service.delete(id)
    }

}
