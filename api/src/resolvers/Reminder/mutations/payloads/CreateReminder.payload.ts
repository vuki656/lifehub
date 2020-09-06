import {
    Field,
    ObjectType,
} from 'type-graphql'

import { ReminderType } from '../../types/Reminder.type'

@ObjectType()
export class CreateReminderPayload {

    @Field()
    public reminder: ReminderType

    constructor(reminder: ReminderType) {
        this.reminder = reminder
    }

}
