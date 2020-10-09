import { createGlobalStyle } from 'styled-components'

import { Theme } from "./theme.types"

export const GlobalStyles = createGlobalStyle<{theme: Theme}>((props) => {
    return {
        '#__next': {
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            width: '100%',
        },
        '*': { boxSizing: "border-box" },
        '::-webkit-scrollbar': { width: 0 },
        a: {
            color: 'inherit',
            textDecoration: 'none',
        },
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
        p: { margin: 0 },
    }
})
