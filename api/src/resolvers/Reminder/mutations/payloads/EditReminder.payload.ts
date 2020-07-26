import {
    Field,
    ObjectType,
} from 'type-graphql'

import { ReminderType } from '../../Reminder.type'

@ObjectType()
export class EditReminderPayload {

    @Field()
    public reminder: ReminderType

    constructor(reminder: ReminderType) {
        this.reminder = reminder
    }

}
