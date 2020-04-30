import React from 'react'

import { DaysSidebar } from '../modules/Dashboard/DaysSidebar'
import { Reminders } from '../modules/Dashboard/Reminders'
import { TodoArea } from '../modules/Dashboard/TodoArea'

export const DashboardPage: React.FC<{}> = () => {
    return (
        <div className="dashboard">
            <DaysSidebar />
            <TodoArea />
            <Reminders />
        </div>
    )
}
