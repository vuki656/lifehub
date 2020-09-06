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

    public async findOne(id: string): Promise<ReminderType | null> {
        const reminder = await this.repository.findOne(id)

        if (!reminder) return null

        return new ReminderType(reminder)
    }

    public async findByDate(
        date: Date,
        context: ContextType,
    ): Promise<ReminderType[]> {
        const { userId } = context

        const reminders = await this.repository.find({
            where: {
                endDate: MoreThanOrEqual(date),
                startDate: LessThanOrEqual(date),
                user: { id: userId },
            },
        })

        return reminders?.map((reminder) => new ReminderType(reminder))
    }

    public async create(
        input: CreateReminderInput,
        context: ContextType,
    ): Promise<CreateReminderPayload> {
        const { userId } = context

        const {
            title,
            note,
            startDate,
            endDate,
        } = input

        const createdReminder = await this.repository.save({
            endDate,
            note,
            startDate,
            title,
            user: { id: userId },
        })

        return new CreateReminderPayload(createdReminder)
    }

    public async edit(input: EditReminderInput): Promise<EditReminderPayload> {
        const editedReminder = await this.repository.save(input)

        return new EditReminderPayload(editedReminder)
    }

    public async delete(id: string): Promise<DeleteReminderPayload> {
        await this.repository.delete({ id })

        return new DeleteReminderPayload(id)
    }

}
