import { createGlobalStyle } from 'styled-components'

// TODO: FIX
export const GlobalStyles = createGlobalStyle((props) => {
    return {
        '#__next': {
            height: '100%',
            width: '100%',
        },
        a: { textDecoration: 'none' },
        body: {
            backgroundColor: props.theme.palette.greys.lighter,
            fontFamily: props.theme.typography.fontFamily.primary,
            margin: '0px',
        },
        html: {
            boxSize: 'border-box',
            fontSize: '16px',
        },
        'html, body': { height: '100%' },
    }
})
