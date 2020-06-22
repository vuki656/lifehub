import {
    Arg,
    Args,
    Authorized,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql'
import {
    CreateReminderArgs,
    EditReminderArgs,
} from './mutations/args'
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
    @Query(() => ReminderType)
    public async reminder(
        @Arg('id') id: string,
    ): Promise<ReminderType> {
        return this.reminderService.reminder(id)
    }

    @Authorized()
    @Query(() => ReminderType)
    public async remindersByDate(
        @Arg('id') id: string,
    ): Promise<ReminderType> {
        return this.reminderService.reminder(id)
    }

    @Authorized()
    @Mutation(() => CreateReminderPayload)
    public async createReminder(
        @Args() args: CreateReminderArgs,
    ): Promise<CreateReminderPayload> {
        return this.reminderService.createReminder(args)
    }

    @Authorized()
    @Mutation(() => EditReminderPayload)
    public async editReminder(
        @Args() args: EditReminderArgs,
    ): Promise<EditReminderPayload> {
        return this.reminderService.editReminder(args)
    }

}
