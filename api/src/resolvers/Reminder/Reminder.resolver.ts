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
    EditReminderPayload,
} from './mutations/payloads'

import { ReminderService } from './Reminder.service'
import { ReminderType } from './Reminder.type'

@Resolver(() => ReminderType)
export class ReminderResolver {

    constructor(
        private readonly reminderService: ReminderService,
    ) {
    }

    @Authorized()
    @Query(() => ReminderType, { nullable: true })
    public async reminder(
        @Arg('id') id: string,
    ): Promise<ReminderType | null> {
        return this.reminderService.findOne(id)
    }

    @Authorized()
    @Query(() => [ReminderType])
    public async remindersByDate(
        @Ctx() context: ContextType,
    ): Promise<ReminderType[]> {
        return this.reminderService.findAll(context)
    }

    @Authorized()
    @Mutation(() => CreateReminderPayload)
    public async createReminder(
        @Arg('input') input: CreateReminderInput,
    ): Promise<CreateReminderPayload> {
        return this.reminderService.create(input)
    }

    @Authorized()
    @Mutation(() => EditReminderPayload)
    public async editReminder(
        @Arg('input') input: EditReminderInput, // TODO: switch to input
    ): Promise<EditReminderPayload> {
        return this.reminderService.edit(input)
    }

}
