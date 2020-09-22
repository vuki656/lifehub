import * as React from 'react'
import { SvgRoot } from "./IconBase.styles"

import { IconBaseProps } from './IconBase.types'

export const IconBase: React.FunctionComponent<IconBaseProps> = (props) => {
    const {
        color = 'white',
        children,
        size = "medium",
        viewBox = "0 0 24 24",
        ...other
    } = props

    return (
        <SvgRoot
            fill={color}
            size={size}
            viewBox={viewBox}
            {...other}
        >
            {children}
        </SvgRoot>
    )
}
