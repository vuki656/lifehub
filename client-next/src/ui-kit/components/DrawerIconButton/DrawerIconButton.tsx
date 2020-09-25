import * as React from 'react'

import { Tooltip } from "../Tooltip"

import { DrawerIconButtonRoot } from "./DrawerIconButton.styles"
import { DrawerIconButtonProps } from "./DrawerIconButton.types"

export const DrawerIconButton = React.forwardRef<HTMLDivElement, DrawerIconButtonProps>((props, ref) => {
    const {
        icon,
        tooltipText,
        selected = false,
        onClick,
        ...other
    } = props

    const core = (
        <DrawerIconButtonRoot
            onClick={onClick}
            ref={ref}
            selected={selected}
            {...other}
        >
            {icon}
        </DrawerIconButtonRoot>
    )

    if (tooltipText) {
        return (
            <Tooltip label={tooltipText}>
                {core}
            </Tooltip>
        )
    }

    return (
        <>
            {core}
        </>
    )
})
