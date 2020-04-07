import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { DashboardPage } from '../../pages/dashboard'
import { RegisterPage } from '../../pages/register'

export const Router = () => (
    <BrowserRouter>
        <Route path="/" component={RegisterPage} exact />
        <Route path="/dashboard" component={DashboardPage} />
    </BrowserRouter>
)
