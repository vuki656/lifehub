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
                        {(() => {
                            const remainingDays = dayjs(reminder.dueDate).diff(new Date(), 'day')

                            // Return correct day, days or today string
                            switch (remainingDays) {
                                case 0:
                                    return 'Today'
                                case 1:
                                    return `${remainingDays} Day`
                                default:
                                    return `${remainingDays} Days`
                            }
                        })()}
                    </ReminderCardRemainingText>
                </ReminderCardRemainingDays>
            </RemindersCardContent>
        </RemindersCardRoot>
    )
}
