import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class EditReminderInput {

    @Field()
    public id: string

    @Field()
    public title: string

    @Field({ nullable: true })
    public note?: string

    @Field()
    public dueDate: Date

}
