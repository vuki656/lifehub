import {
    Field,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class DeleteReminderPayload {

    @Field()
    id: string

    constructor(id: string) {
        this.id = id
    }

}
