import {
    ArgsType,
    Field,
} from 'type-graphql'

@ArgsType()
export class CreateReminderArgs {

    @Field()
    public title: string

    @Field()
    public note: string

    @Field()
    public startDate: Date

    @Field()
    public endDate: Date

}
