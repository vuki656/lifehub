import {
    Field,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class EditTaskSequencePayload {

    @Field()
    id: string

    @Field()
    sequenceNumber: number

}
