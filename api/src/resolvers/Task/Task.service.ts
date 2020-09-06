import { Service } from 'typedi'
import {
    EntityRepository,
    Repository,
} from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { TaskEntity } from '../../entities'

import { FindByDateAndCardArgs } from './args'
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

@EntityRepository()
@Service({ global: true })
export class TaskService {

    constructor(
        @InjectRepository(TaskEntity) private readonly repository: Repository<TaskEntity>,
    ) {
    }

    public async findByDateAndCard(args: FindByDateAndCardArgs): Promise<TaskType[]> {
        const tasks = await this.repository.find({
            card: { id: args.cardId },
            date: args.date,
        })

        return tasks.map((task) => {
            return new TaskType(task)
        })
    }

    public async create(input: CreateTaskInput): Promise<CreateTaskPayload> {
        const createdTask = await this.repository.create({
            card: { id: input.cardId },
            title: input.title,
        })

        return new CreateTaskPayload(createdTask)
    }

    public async edit(input: EditTaskInput): Promise<EditTaskPayload> {
        const editedTask = await this.repository.save(input)

        return new EditTaskPayload(editedTask)
    }

    public async delete(input: DeleteTaskInput): Promise<DeleteTaskPayload> {
        await this.repository.delete({ id: input.id })

        return new DeleteTaskPayload(input.id)
    }

}
