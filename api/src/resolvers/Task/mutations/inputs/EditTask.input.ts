import {
    Field,
    InputType,
} from 'type-graphql'

@InputType()
export class EditTaskInput {

    @Field()
    public id: string

    @Field()
    public title: string

    @Field()
    public note: string

    @Field()
    public date: Date

    @Field()
    public isCompleted: boolean

}
