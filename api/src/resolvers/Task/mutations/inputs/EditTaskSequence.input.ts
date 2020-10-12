import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class EditTaskSequenceInput {

    @Field()
    public id: string

    @Field()
    public sequenceNumber: number

}
