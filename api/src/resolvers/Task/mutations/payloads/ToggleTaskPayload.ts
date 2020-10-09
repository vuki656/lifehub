import {
    Field,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class ToggleTaskPayload {

    @Field()
    public id: string

    @Field()
    public isCompleted: boolean

    constructor(
        id: string,
        isCompleted: boolean,
    ) {
        this.id = id
        this.isCompleted = isCompleted
    }

}
