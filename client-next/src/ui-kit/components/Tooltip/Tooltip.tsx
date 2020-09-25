import Tippy from "@tippyjs/react"
import * as React from 'react'

import { TooltipProps } from "./Tooltip.types"

export const Tooltip: React.FunctionComponent<TooltipProps> = (props) => {
    const {
        label,
        children,
        ...other
    } = props

    return (
        <Tippy
            content={label}
            delay={[
                400,
                null,
            ]}
            {...other}
        >
            {children}
        </Tippy>
    )
}
