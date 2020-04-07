import { ApolloProvider } from '@apollo/react-hooks'
import { StylesProvider } from '@material-ui/core/styles'
import ApolloClient from 'apollo-boost'
import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'

import './assets/scss/styles.scss'
import { Router } from './components/Router'

const client = new ApolloClient({ uri: 'http://localhost:4000' })

const renderApp = () => (
    <ApolloProvider client={client}>
        <StylesProvider injectFirst>
            <Router />
        </StylesProvider>
    </ApolloProvider>
)

ReactDOM.render(renderApp(), document.getElementById('root'))
