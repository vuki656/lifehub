import * as React from 'react'

import { IconBase } from '../../components/IconBase'
import { IconCommonProps } from '../Icon.types'

export const TrashIcon = React.memo<IconCommonProps>((props) => {
    return (
        <IconBase {...props}>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
        </IconBase>
    )
})
