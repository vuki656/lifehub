import moment from 'moment'
import React from 'react'
import { Redirect } from 'react-router-dom'

import { DaysSidebar } from '../modules/Dashboard/DaysSidebar'
import { Reminders } from '../modules/Dashboard/Reminders'
import { TaskArea } from '../modules/Dashboard/TaskArea'

export const DashboardPage: React.FC<{}> = () => {
    return (
        <div className="dashboard">
            {/* Redirects to today on each refresh, prevents route mismatches */}
            <Redirect
                exact
                from="/dashboard"
                to={`/dashboard/${moment().format('DoddddMMYYYY')}`}
                component={DashboardPage}
            />
            <DaysSidebar />
            <TaskArea />
            <Reminders />
        </div>
    )
}
