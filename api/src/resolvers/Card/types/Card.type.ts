import {
    Field,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class CardType {

    @Field()
    public id: string

    @Field()
    public name: string

    constructor(card: CardType) {
        this.id = card.id
        this.name = card.name
    }

}
