import {
    Field,
    ObjectType,
} from 'type-graphql'

@ObjectType()
export class TaskType {

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
