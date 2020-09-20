import * as React from 'react'

import { PanelRoot } from './Panel.styles'
import { PanelProps } from './Panel.types'

export const Panel: React.FunctionComponent<PanelProps> = (props) => {
    const {
        children,
        spacing,
        ...other
    } = props

    return (
        <PanelRoot
            spacing={spacing}
            {...other}
        >
            {children}
        </PanelRoot>
    )
}
