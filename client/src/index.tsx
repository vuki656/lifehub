import { ApolloProvider } from '@apollo/react-hooks'
import { StylesProvider } from '@material-ui/core/styles'
import ApolloClient from 'apollo-boost'
import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './assets/scss/styles.scss'
import { Router } from './components/Router'
import store from './redux/store'

const client = new ApolloClient({ uri: 'http://localhost:4000' })

const renderApp = () => (
    <ApolloProvider client={client}>
        <Provider store={store}>
            <StylesProvider injectFirst>
                <Router />
            </StylesProvider>
        </Provider>
    </ApolloProvider>
)

ReactDOM.render(renderApp(), document.getElementById('root'))
