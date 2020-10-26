import { Service } from 'typedi'
import {
    EntityRepository,
    Repository,
} from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { TaskEntity } from '../../entities'

import {
    TaskArgs,
    TasksArgs,
} from './args'
import {
    CreateTaskInput,
    DeleteTaskInput,
    EditTaskInput,
    EditTaskSequenceInput,
    MoveTaskToTodayInput,
    ToggleTaskInput,
} from './mutations/inputs'
import {
    CreateTaskPayload,
    DeleteTaskPayload,
    EditTaskPayload,
    MoveTaskToTodayPayload,
    ToggleTaskPayload,
} from './mutations/payloads'
import { TaskType } from './types'

@EntityRepository()
@Service({ global: true })
export class TaskService {

    constructor(
        @InjectRepository(TaskEntity) private readonly repository: Repository<TaskEntity>,
    ) {
    }

    public async findOne(input: TaskArgs) {
        const task = await this.repository.findOne(input.id)

        if (!task) {
            throw new Error('Task not found.')
        }

        return new TaskType(task)
    }

    public async findByDateAndCard(args: TasksArgs) {
        const tasks = await this.repository.find({
            card: { id: args.cardId },
            date: args.date,
        })

        return tasks.map((task) => {
            return new TaskType(task)
        })
    }

    public async create(input: CreateTaskInput) {
        const sequenceNumber = await this.getNextSequenceNumber(input.cardId)

        const createdTask = await this.repository.save({
            card: { id: input.cardId },
            date: input.date,
            sequenceNumber: sequenceNumber,
            title: input.title,
        })

        return new CreateTaskPayload(createdTask)
    }

    public async edit(input: EditTaskInput) {
        const editedTask = await this.repository.save(input)

        return new EditTaskPayload(editedTask)
    }

    public async delete(input: DeleteTaskInput) {
        await this.repository.delete({ id: input.id })

        return new DeleteTaskPayload(input.id)
    }

    public async toggle(input: ToggleTaskInput) {
        const {
            taskId,
            isCompleted,
        } = input

        await this.repository.save({
            id: taskId,
            isCompleted: isCompleted,
        })

        return new ToggleTaskPayload(taskId, isCompleted)
    }

    public async moveToToday(input: MoveTaskToTodayInput) {
        await this.repository.save({
            date: new Date(),
            id: input.id,
        })

        return new MoveTaskToTodayPayload(input.id)
    }

    public async editSequence(input: EditTaskSequenceInput[]) {
        return this.repository.save(input)
    }

    // Gets next in line sequence number for a specific card
    public async getNextSequenceNumber(cardId: string) {
        const sequenceNumbers = await this.repository
        .createQueryBuilder('tasks')
        .where('card_id = :cardId', { cardId })
        .select('MAX(sequence_number)', 'max')
        .getRawOne()

        if (!sequenceNumbers.max) {
            return 1
        }

        return sequenceNumbers.max + 1
    }

}
