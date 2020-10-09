import { Service } from 'typedi'
import {
    EntityRepository,
    LessThanOrEqual,
    MoreThanOrEqual,
    Repository,
} from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ContextType } from '../../../global/types/context.type'
import { ReminderEntity } from '../../entities'

import {
    RemindersArgs,
    RemindersTimeSpanEnum,
} from './args'
import {
    CreateReminderInput,
    EditReminderInput,
} from './mutations/input'
import {
    CreateReminderPayload,
    DeleteReminderPayload,
    EditReminderPayload,
} from './mutations/payloads'
import { ReminderType } from './types'

@EntityRepository()
@Service({ global: true })
export class ReminderService {

    constructor(
        @InjectRepository(ReminderEntity) private readonly repository: Repository<ReminderEntity>,
    ) {
    }

    public async findOne(id: string) {
        const reminder = await this.repository.findOne(id)

        if (!reminder) return null

        return new ReminderType(reminder)
    }

    public async findAllByTimeSpan(
        args: RemindersArgs,
        context: ContextType,
    ) {
        const timeSpanConditions = this.getTimeSpanConditions(args.timeSpan)

        const reminders = await this.repository.find({
            where: {
                ...timeSpanConditions,
                user: { id: context.userId },
            },
        })

        return reminders?.map((reminder) => {
            return new ReminderType(reminder)
        })
    }

    public async create(
        input: CreateReminderInput,
        context: ContextType,
    ) {
        const createdReminder = await this.repository.save({
            ...input,
            user: { id: context.userId },
        })

        return new CreateReminderPayload(createdReminder)
    }

    public async edit(input: EditReminderInput) {
        const editedReminder = await this.repository.save(input)

        return new EditReminderPayload(editedReminder)
    }

    public async delete(id: string) {
        await this.repository.delete({ id })

        return new DeleteReminderPayload(id)
    }

    public getTimeSpanConditions(timeSpan: RemindersTimeSpanEnum) {
        switch (timeSpan) {
            case 'all':
                return {}
            case 'future':
                return { dueDate: MoreThanOrEqual(new Date()) }
            case 'past':
                return { dueDate: LessThanOrEqual(new Date()) }
        }
    }

}
