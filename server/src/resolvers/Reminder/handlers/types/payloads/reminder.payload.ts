import { UserPayload } from '../../../../User/types/payloads'

export type ReminderPayload = {
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    user: UserPayload,
}
