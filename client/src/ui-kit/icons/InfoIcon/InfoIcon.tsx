import * as React from 'react'

import { IconBase } from '../../components/IconBase'
import { IconCommonProps } from "../Icon.types"

export const InfoIcon = React.memo<IconCommonProps>((props) => {
    return (
        <IconBase {...props}>
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0
            15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1
            .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"
            />
        </IconBase>
    )
})
