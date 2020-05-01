import { ApolloProvider } from '@apollo/react-hooks'
import 'normalize.css'
import React from 'react'

import 'react-datepicker/dist/react-datepicker.css'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './assets/scss/styles.scss'
import { Router } from './components/Router'
import store from './redux/store'
import { client } from './util/apollo'

const renderApp = () => (
    <ApolloProvider client={client}>
        <Provider store={store}>
            <Router />
        </Provider>
    </ApolloProvider>
)

ReactDOM.render(renderApp(), document.getElementById('root'))
