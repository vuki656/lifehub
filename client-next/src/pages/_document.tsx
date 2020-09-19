import Document, {
    DocumentContext,
    DocumentInitialProps,
    Head,
    Html,
    Main,
    NextScript,
} from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

class CustomDocument extends Document {

    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () => {
                return originalRenderPage({
                    enhanceApp: (App) => {
                        return (props) => {
                            return sheet.collectStyles(<App {...props} />)
                        }
                    },
                })
            }

            const initialProps = await Document.getInitialProps(ctx)

            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    public render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <link
                        crossOrigin=""
                        href="https://fonts.googleapis.com/css?family=Roboto|Archivo+Web&display=swap"
                        rel="stylesheet"
                    />
                    <meta
                        content="#373D4D"
                        name="theme-color"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }

}

export default CustomDocument
