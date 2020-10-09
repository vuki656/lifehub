import * as React from 'react'

import { IconBase } from '../../components/IconBase'
import { IconCommonProps } from '../Icon.types'

export const DownIcon = React.memo<IconCommonProps>((props) => {
    return (
        <IconBase {...props}>
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </IconBase>
    )
})
