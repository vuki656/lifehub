import { GraphQLDate } from 'graphql-iso-date'
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

    @Field({ nullable: true })
    public note?: string

    @Field(() => GraphQLDate)
    public date: Date

    @Field()
    public isCompleted: boolean

    @Field()
    public sequenceNumber: number

    constructor(task: TaskType) {
        this.id = task.id
        this.title = task.title
        this.note = task.note
        this.date = task.date
        this.isCompleted = task.isCompleted
        this.sequenceNumber = task.sequenceNumber
    }

}
