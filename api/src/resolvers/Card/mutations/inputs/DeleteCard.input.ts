import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class DeleteCardInput {

    @Field()
    public id: string

}
