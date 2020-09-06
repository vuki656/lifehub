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

    constructor(task: TaskType) {
        this.id = task.id
        this.title = task.title
        this.note = task.note
        this.date = task.date
        this.isCompleted = task.isCompleted
    }

}
