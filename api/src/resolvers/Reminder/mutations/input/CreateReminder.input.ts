import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class CreateReminderInput {

    @Field()
    public title: string

    @Field({ nullable: true })
    public note?: string

    @Field()
    public dueDate: Date

}
