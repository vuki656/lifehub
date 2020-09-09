import { ApolloProvider } from '@apollo/client'
import NextApp from 'next/app'
import * as React from 'react'

import { useApollo } from '../lib/apolloClient'
import {
    createTheme,
    ThemeProvider,
} from '../ui-kit/styles'

class App extends NextApp {

    private readonly theme = createTheme()

    public render(): JSX.Element {
        const {
            Component,
            pageProps,
        } = this.props

        const apolloClient = useApollo(pageProps.initialApolloState)

        return (
            <ApolloProvider client={apolloClient}>
                <ThemeProvider theme={this.theme}>
                    <Component {...pageProps} />
                </ThemeProvider>
            </ApolloProvider>
        )
    }

}

export default App
