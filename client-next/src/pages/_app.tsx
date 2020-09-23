import { ApolloProvider } from "@apollo/client"
import { AppProps } from "next/app"
import { useRouter } from "next/router"
import React from "react"
import 'tippy.js/dist/tippy.css' // optional
import { SideMenu } from "../components/SideMenu"
import { useApollo } from '../lib/apolloClient'
import {
    createTheme,
    GlobalStyles,
    ThemeProvider,
} from "../ui-kit/styles"
import 'react-datepicker/dist/react-datepicker.css'

const App = (props: AppProps): JSX.Element => {
    const {
        Component,
        pageProps,
    } = props
    const { pathname } = useRouter()

    const client = useApollo(pageProps.initialApolloState)
    const theme = createTheme()

    let RenderComponent

    if (
        pathname.includes('login') ||
        pathname.includes('register')
    ) {
        RenderComponent = <Component {...pageProps} />
    } else {
        RenderComponent = (
            <>
                <SideMenu />
                <Component {...pageProps} />
            </>
        )
    }

    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                {RenderComponent}
            </ThemeProvider>
        </ApolloProvider>
    )
}

export default App
