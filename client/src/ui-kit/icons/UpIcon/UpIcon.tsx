import * as React from 'react'

import { IconBase } from '../../components/IconBase'
import { IconCommonProps } from "../Icon.types"

export const UpIcon = React.memo<IconCommonProps>((props) => {
    return (
        <IconBase {...props}>
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </IconBase>
    )
})
