import * as React from 'react'

import { IconBaseProps } from './IconBase.types'

export const IconBase: React.FunctionComponent<IconBaseProps> = (props) => {
    const {
        color = 'white',
        children,
        viewBox = '0 0 24 24',
        ...other
    } = props

    return (
        <svg
            fill={color}
            viewBox={viewBox}
            width="24px"
            height="24px"
            {...other}
        >
            {children}
        </svg>
    )
}
