import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class TasksArgs {

    @Field()
    public date: Date

    @Field()
    public cardId: string

}
