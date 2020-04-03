import { StylesProvider } from '@material-ui/core/styles'
import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'

import './assets/scss/styles.scss'
import { RegisterPage } from './pages/register'

const renderApp = () => (
    <StylesProvider injectFirst>
        <RegisterPage />
    </StylesProvider>
)

ReactDOM.render(renderApp(), document.getElementById('root'))
