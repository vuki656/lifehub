import {
    Field,
    ObjectType,
} from 'type-graphql'

import { TaskType } from '../../Task/types'

@ObjectType()
export class CardType {

    @Field()
    public id: string

    @Field()
    public name: string

    @Field(() => [TaskType])
    public tasks: TaskType[]

    constructor(card: CardType) {
        this.id = card.id
        this.name = card.name
        this.tasks = card.tasks
    }

}
