import {
    Field,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class DeleteCardPayload {

    @Field()
    public id: string

    constructor(id: string) {
        this.id = id
    }

}
