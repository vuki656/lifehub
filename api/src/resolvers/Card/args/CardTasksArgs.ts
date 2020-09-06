import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class CardTasksArgs {

    @Field()
    public date: Date

}
