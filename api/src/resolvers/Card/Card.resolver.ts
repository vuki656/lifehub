import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    Mutation,
    Query,
    Resolver,
    Root,
} from 'type-graphql'

import { ContextType } from '../../../global/types/context.type'
import { TaskService } from '../Task'
import { TaskType } from '../Task/types'

import { CardService } from './Card.service'
import { CardTasksArgs } from './args'
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
        private readonly taskService: TaskService,
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

    @Authorized()
    @FieldResolver(() => [TaskType])
    public async tasks(
        @Root() card: CardType,
        @Arg('args') args: CardTasksArgs,
    ): Promise<TaskType[]> {
        return this.taskService.findByDateAndCard({
            cardId: card.id,
            date: args.date,
        })
    }

}
