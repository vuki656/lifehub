import {
    ArgsType,
    Field,
    ID,
} from 'type-graphql'

@ArgsType()
export class EditReminderArgs {

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
