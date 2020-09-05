import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class CreateCardInput {

    @Field()
    public name: string

}
