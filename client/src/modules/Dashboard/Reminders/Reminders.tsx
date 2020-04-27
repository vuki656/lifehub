import React from 'react'
import { useToggle } from 'react-use'

import { ReminderDialog } from './ReminderDialog'

export const Reminders: React.FC<{}> = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)

    return (
        <div className="reminders">
            <p className="title">Reminders</p>
            <button onClick={toggleDialog}>Create Reminder</button>
            <ReminderDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
        </div>
    )
}
