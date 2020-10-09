import { Service } from 'typedi'
import {
    EntityRepository,
    Repository,
} from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ContextType } from '../../../global/types/context.type'
import { CardEntity } from '../../entities'

import {
    CreateCardInput,
    DeleteCardInput,
    EditCardInput,
} from './mutations/inputs'
import {
    CreateCardPayload,
    DeleteCardPayload,
    EditCardPayload,
} from './mutations/payloads'
import { CardType } from './types'

@EntityRepository()
@Service({ global: true })
export class CardService {

    constructor(
        @InjectRepository(CardEntity) private readonly repository: Repository<CardEntity>,
    ) {
    }

    public async findAll(context: ContextType): Promise<CardType[]> {
        const cards = await this.repository.find({ where: { user: { id: context.userId } } })

        return cards.map((card) => {
            return new CardType(card)
        })
    }

    public async create(
        input: CreateCardInput,
        context: ContextType,
    ): Promise<CreateCardPayload> {
        const createdCard = await this.repository.save({
            name: input.name,
            user: { id: context.userId },
        })

        return new CreateCardPayload(createdCard)
    }

    public async edit(
        input: EditCardInput,
    ): Promise<EditCardPayload> {
        const editedCard = await this.repository.save({
            id: input.id,
            name: input.name,
        })

        return new EditCardPayload(editedCard)
    }

    public async delete(input: DeleteCardInput): Promise<DeleteCardPayload> {
        await this.repository.delete({ id: input.id })

        return new DeleteCardPayload(input.id)
    }

}
