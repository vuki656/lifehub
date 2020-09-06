import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class DeleteTaskInput {

    @Field()
    public id: string

}
