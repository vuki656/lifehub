import { createGlobalStyle } from 'styled-components'

// TODO: FIX
export const GlobalStyles = createGlobalStyle((props) => {
    return {
        '#__next': {
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
        },
        '*': { boxSizing: "border-box" },
        '::-webkit-scrollbar': { width: 0 },
        a: { textDecoration: 'none' },
        body: {
            backgroundColor: props.theme.palette.grey.light500,
            fontFamily: props.theme.typography.fontFamily.primary,
            margin: '0px',
            overflow: "hidden",
        },
        html: {
            boxSize: 'border-box',
            fontSize: '16px',
        },
        'html, body': { height: '100%' },
    }
})
