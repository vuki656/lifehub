import dayjs from "dayjs"
import advancedFormat from 'dayjs/plugin/advancedFormat'
import * as React from 'react'

import {
    ReminderCardDate,
    ReminderCardDateIcon,
    ReminderCardDateText,
    ReminderCardRemainingDays,
    ReminderCardRemainingDaysIcon,
    ReminderCardRemainingText,
    RemindersCardContent,
    RemindersCardRoot,
    RemindersCardTitle,
} from "./RemindersCard.styles"
import { RemindersCardProps } from "./RemindersCard.types"

dayjs.extend(advancedFormat)

export const RemindersCard: React.FunctionComponent<RemindersCardProps> = (props) => {
    const { reminder } = props

    const getRemainingDays = () => {
        const remainingDays = dayjs(reminder.dueDate).diff(new Date(), 'day')

        if (remainingDays === 0) {
            return 'Today'
        } else if (remainingDays === 1) {
            return `${remainingDays} Day`
        } else if (remainingDays === -1) {
            return "Yesterday"
        } else if (remainingDays > 1) {
            return `${remainingDays} Days`
        } else if (remainingDays < -1) {
            // Splits the negative number string by -
            // -29 will be split into "" and "29"
            const [_, days] = String(remainingDays).split("-")

            return `${days} Days Ago`
        }
    }

    return (
        <RemindersCardRoot>
            <RemindersCardTitle>
                {reminder.title}
            </RemindersCardTitle>
            <RemindersCardContent>
                <ReminderCardDate>
                    <ReminderCardDateIcon size="small" />
                    <ReminderCardDateText>
                        {dayjs(reminder.dueDate).format('Do MMM')}
                    </ReminderCardDateText>
                </ReminderCardDate>
                <ReminderCardRemainingDays>
                    <ReminderCardRemainingDaysIcon size="small" />
                    <ReminderCardRemainingText>
                        {getRemainingDays()}
                    </ReminderCardRemainingText>
                </ReminderCardRemainingDays>
            </RemindersCardContent>
        </RemindersCardRoot>
    )
}
