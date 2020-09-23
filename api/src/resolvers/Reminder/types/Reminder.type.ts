import {
    Field,
    ObjectType,
} from 'type-graphql'

import { UserType } from '../../User'

@ObjectType()
export class ReminderType {

    @Field()
    public id: string

    @Field()
    public title: string

    @Field()
    public note: string

    @Field()
    public dueDate: Date

    @Field(() => UserType)
    public user: UserType

    constructor(reminder: ReminderType) {
        this.id = reminder.id
        this.title = reminder.title
        this.note = reminder.note
        this.dueDate = reminder.dueDate
    }

}
