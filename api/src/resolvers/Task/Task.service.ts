import { Service } from 'typedi'
import {
    EntityRepository,
    Repository,
} from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { TaskEntity } from '../../entities'

import { CreateTaskInput } from './mutations/inputs'
import { CreateTaskPayload } from './mutations/payloads/CreateTask.payload'

@EntityRepository()
@Service({ global: true })
export class TaskService {

    constructor(
        @InjectRepository(TaskEntity) private readonly repository: Repository<TaskEntity>,
    ) {
    }

    public async create(
        input: CreateTaskInput,
    ): Promise<CreateTaskPayload> {
        const createdTask = await this.repository.create({
            card: { id: input.cardId },
            title: input.title,
        })

        return new CreateTaskPayload(createdTask)
    }

}
