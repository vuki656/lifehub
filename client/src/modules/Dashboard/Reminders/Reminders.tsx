import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined'
import React from 'react'
import { useToggle } from 'react-use'

import { ReminderDialog } from './ReminderDialog'
import { ReminderList } from './ReminderList'

export const Reminders: React.FC<{}> = () => {
    const [isDialogOpen, toggleDialog] = useToggle(false)

    return (
        <div className="reminders">
            <div className="reminders__header">
                <p className="title">Reminders</p>
                <AddBoxOutlinedIcon className="reminders__icon" onClick={toggleDialog} />
            </div>
            <ReminderDialog isDialogOpen={isDialogOpen} toggleDialog={toggleDialog} />
            <ReminderList />
        </div>
    )
}
