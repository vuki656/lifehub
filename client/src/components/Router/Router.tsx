import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { DashboardPage } from '../../pages/dashboard'
import { LoginPage } from '../../pages/login'
import { RegisterPage } from '../../pages/register'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

export const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" component={RegisterPage} exact />
            <Route path="/login" component={LoginPage} />
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
        </Switch>
    </BrowserRouter>
)
