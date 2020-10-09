import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class EditCardInput {

    @Field()
    public id: string

    @Field()
    public name: string

}
