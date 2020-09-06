import { ApolloProvider } from '@apollo/client'
import NextApp from 'next/app'
import * as React from 'react'

import { useApollo } from '../lib/apolloClient'

class App extends NextApp {

    public render(): JSX.Element {
        const {
            Component,
            pageProps,
        } = this.props

        const apolloClient = useApollo(pageProps.initialApolloState)

        return (
            <ApolloProvider client={apolloClient}>
                <Component {...pageProps} />
            </ApolloProvider>
        )
    }

}

export default App
