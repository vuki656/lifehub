import {
    Field,
    ID,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class CreateReminderPayload {

    @Field(() => ID)
    public id: string

    @Field(() => String)
    public title: string

    @Field(() => String)
    public note: string

    @Field(() => Date)
    public startDate: Date

    @Field(() => Date)
    public endDate: Date

}
