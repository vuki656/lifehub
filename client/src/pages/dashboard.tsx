import dayjs from 'dayjs'
import React from 'react'
import { Redirect } from 'react-router-dom'

import { DaysSidebar } from '../modules/Dashboard/DaysSidebar'
import { Reminders } from '../modules/Dashboard/Reminders'
import { TaskArea } from '../modules/Dashboard/TaskArea'

export const DashboardPage: React.FC = () => {
    const todayUnix = dayjs().startOf('day').valueOf()

    return (
        <div className="dashboard">
            {/* Redirects to today on each refresh to prevent route mismatch */}
            <Redirect
                exact
                from="/dashboard"
                to={`/dashboard/${todayUnix}`}
                component={DashboardPage}
            />
            <DaysSidebar />
            <TaskArea />
            <Reminders />
        </div>
    )
}
