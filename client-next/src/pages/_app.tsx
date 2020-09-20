import { ApolloProvider } from "@apollo/client"
import { AppProps } from "next/app"
import React from "react"
import { useApollo } from '../lib/apolloClient'
import {
    createTheme,
    GlobalStyles,
    ThemeProvider,
} from "../ui-kit/styles"

const App = (props: AppProps): JSX.Element => {
    const {
        Component,
        pageProps,
    } = props

    const client = useApollo(pageProps.initialApolloState)

    const theme = createTheme()

    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <Component {...pageProps} />
            </ThemeProvider>
        </ApolloProvider>
    )
}

export default App
