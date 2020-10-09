import * as React from 'react'

import { Reminders } from '../Reminders'
import { Tasks } from '../Tasks'

import { DashboardRoot } from './Dashboard.styles'

export const Dashboard: React.FunctionComponent = () => {
    return (
        <DashboardRoot>
            <Tasks />
            <Reminders />
        </DashboardRoot>
    )
}
