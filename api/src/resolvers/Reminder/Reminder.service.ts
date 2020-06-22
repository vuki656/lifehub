import { Repository } from 'typeorm'

import { ReminderEntity } from '../../entities'
import {
    CreateReminderArgs,
    EditReminderArgs,
} from './mutations/args'
import {
    CreateReminderPayload,
    EditReminderPayload,
} from './mutations/payloads'

import { ReminderType } from './Reminder.type'

export class ReminderService {

    constructor(
        private readonly repository: Repository<ReminderEntity>,
    ) {
    }

    public async reminder(id: string): Promise<ReminderType> {
        const reminder = await this.repository.findOne(id)

        if (!reminder) throw new Error('Reminder doesn\'t exist.') // TODO: better error throw

        return new ReminderType(reminder)
    }

    public async createReminder(args: CreateReminderArgs): Promise<CreateReminderPayload> {
        return this.repository.save(args)
    }

    public async editReminder(args: EditReminderArgs): Promise<EditReminderPayload> {
        const reminder = this.repository.findOne(args.id)

        if (!reminder) throw new Error('Reminder doesn\'t exist.') // TODO: better error throw

        return this.repository.save(args)
    }

}
