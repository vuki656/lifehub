import {
    Arg,
    Authorized,
    Ctx,
    Mutation,
    Query,
    Resolver,
} from 'type-graphql'

import { ContextType } from '../../../global/types/context.type'

import { CardService } from './Card.service'
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

@Resolver(() => CardType)
export class CardResolver {

    constructor(
        private readonly service: CardService,
    ) {
    }

    @Authorized()
    @Mutation(() => CreateCardPayload)
    public async createCard(
        @Arg('input') input: CreateCardInput,
        @Ctx() context: ContextType,
    ): Promise<CreateCardPayload> {
        return this.service.create(input, context)
    }

    @Authorized()
    @Mutation(() => EditCardPayload)
    public async editCard(
        @Arg('input') input: EditCardInput,
    ): Promise<EditCardPayload> {
        return this.service.edit(input)
    }

    @Authorized()
    @Mutation(() => DeleteCardPayload)
    public async deleteCard(
        @Arg('input') input: DeleteCardInput,
    ): Promise<DeleteCardPayload> {
        return this.service.delete(input)
    }

    @Authorized()
    @Query(() => [CardType])
    public async cards(
        @Ctx() context: ContextType,
    ): Promise<CardType[]> {
        return this.service.findAll(context)
    }

}
