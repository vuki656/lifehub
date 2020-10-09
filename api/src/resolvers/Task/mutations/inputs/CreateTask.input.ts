import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class CreateTaskInput {

    @Field()
    public title: string

    @Field()
    public date: Date

    @Field()
    public cardId: string

}
