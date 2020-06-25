import {
    Field,
    ID,
    InputType,
} from 'type-graphql'

@InputType()
export class EditReminderInput {

    @Field(() => ID)
    public id: string

    @Field()
    public title: string

    @Field()
    public note: string

    @Field()
    public startDate: Date

    @Field()
    public endDate: Date

}
