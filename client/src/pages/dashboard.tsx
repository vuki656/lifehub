import React from 'react'

import { DaysSidebar } from '../modules/Dashboard/DaysSidebar'
import { Reminders } from '../modules/Dashboard/Reminders'
import { TaskArea } from '../modules/Dashboard/TaskArea'

export const DashboardPage: React.FC<{}> = () => {
    return (
        <div className="dashboard">
            <DaysSidebar />
            <TaskArea />
            <Reminders />
        </div>
    )
}
