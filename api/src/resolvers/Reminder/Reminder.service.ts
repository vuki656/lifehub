import dayjs from 'dayjs'
import {
    MoreThanOrEqual,
    Repository,
} from 'typeorm'

import { ContextType } from '../../../global/types/context.type'
import { ReminderEntity } from '../../entities'
import {
    CreateReminderInput,
    EditReminderInput,
} from './mutations/input'
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

    public async findOne(id: string): Promise<ReminderType | null> {
        const reminder = await this.repository.findOne(id)

        if (!reminder) return null

        return new ReminderType(reminder)
    }

    public async findAll(context: ContextType): Promise<ReminderType[]> {
        const { user } = context

        const today = dayjs().toDate()

        const reminders = await this.repository.find({
            where: {
                endDate: MoreThanOrEqual(today),
                user: { id: user.id },
            },
        })

        return reminders.map((reminder) => new ReminderType(reminder))
    }

    public async create(input: CreateReminderInput): Promise<CreateReminderPayload> {
        return this.repository.save(input)
    }

    public async edit(input: EditReminderInput): Promise<EditReminderPayload> {
        return this.repository.save(input)
    }

}
