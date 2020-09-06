import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class FindByDateAndCardArgs {

    @Field()
    public date: Date

    @Field()
    public cardId: string

}
