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
    public startDate: Date

    @Field()
    public endDate: Date

    @Field(() => UserType)
    public user: UserType

    constructor(reminder: ReminderType) {
        this.id = reminder.id
        this.title = reminder.title
        this.note = reminder.note
        this.startDate = reminder.startDate
        this.endDate = reminder.endDate
    }

}
