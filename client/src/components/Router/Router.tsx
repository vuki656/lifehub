import dayjs from 'dayjs'
import React from 'react'
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'

import { DashboardPage } from '../../pages/dashboard'
import { LoginPage } from '../../pages/login'
import { RegisterPage } from '../../pages/register'
import { SettingsPage } from '../../pages/settings'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

export const Router: React.FC = () => {
    const today = `/dashboard/${dayjs().startOf('day').valueOf()}`

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={RegisterPage} exact />
                <Route path="/login" component={LoginPage} />
                <ProtectedRoute path="/dashboard" component={DashboardPage} />
                <Redirect from="/dashboard" to={today} component={DashboardPage} exact />
                <ProtectedRoute path="/settings" component={SettingsPage} />
            </Switch>
        </BrowserRouter>
    )
}
