import { useQuery } from '@apollo/react-hooks'
import AddRoundedIcon from '@material-ui/icons/AddRounded'
import React from 'react'
import { useSelector } from 'react-redux'
import { useToggle } from 'react-use'

import { REMINDERS_BY_DATE } from '../../../graphql/queries/reminder.queries'
import {
    RemindersByDateQuery,
    RemindersByDateQueryVariables,
} from '../../../graphql/types'
import { renderLoaders } from '../../../util/helpers/renderLoaders'

import { ReminderCard } from './ReminderCard'
import { ReminderCardLoader } from './ReminderCardLoader'
import { ReminderDialog } from './ReminderDialog'

export const Reminders: React.FC = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)
    const { selectedDate } = useSelector((state: any) => state.user)

    const {
        error,
        data,
        loading,
    } = useQuery<RemindersByDateQuery, RemindersByDateQueryVariables>(
        REMINDERS_BY_DATE, {
            fetchPolicy: 'cache-and-network',
            variables: { date: selectedDate },
        },
    )

    return (
        <div className="reminders">
            <div className="reminders__header">
                <p className="title">Reminders</p>
                <div className="reminders__button button--secondary">
                    <p className="reminders__header-text" onClick={toggleDialog}>
                        Add <AddRoundedIcon className="reminders__icon" />
                    </p>
                </div>
            </div>
            {loading
                ? (renderLoaders(4, <ReminderCardLoader />))
                : (
                    <>
                        {(() => {
                            const reminders = data?.remindersByDate || []

                            // if (reminders.length === 0) {
                            //     return (
                            //         <p className="info-message">
                            //             No reminders <span role="img" aria-label="calendar">📅</span>
                            //         </p>
                            //     )
                            // }

                            const sortedReminders = reminders.sort((a, b) => {
                                return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
                            })

                            return sortedReminders.map((reminder) => (
                                <ReminderCard reminder={reminder} key={reminder.id} />
                            ))
                        })()}
                        {/* {error && <Message message={'Something wen\'t wrong, please try again.'} type="error" />} */}
                        <ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} /><ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} /><ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} /><ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} /><ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} /><ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} /><ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} /><ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} /><ReminderCard reminder={{
                            endDate: new Date(),
                            startDate: new Date(),
                            title: '123',
                        }} />
                    </>
                )
            }
            <ReminderDialog
                isDialogOpen={isDialogOpen}
                toggleDialog={toggleDialog}
            />
        </div>
    )
}
