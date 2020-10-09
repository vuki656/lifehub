import {
    Field,
    ObjectType,
} from 'type-graphql'

import { CardType } from '../../types'

@ObjectType()
export class CreateCardPayload {

    @Field()
    public card: CardType

    constructor(card: CardType) {
        this.card = card
    }

}
