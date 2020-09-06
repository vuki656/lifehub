import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class CreateReminderInput {

    @Field()
    public title: string

    @Field()
    public note: string

    @Field()
    public startDate: Date

    @Field()
    public endDate: Date

}
