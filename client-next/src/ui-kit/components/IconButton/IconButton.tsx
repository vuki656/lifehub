import * as React from 'react'

import { IconButtonRoot } from "./IconButton.stypes"
import { IconButtonProps } from "./IconButton.types"

export const IconButton: React.FunctionComponent<IconButtonProps> = (props) => {
    const {
        icon,
        size = "medium",
        variant = "primary",
        ...other
    } = props

    return (
        <IconButtonRoot
            variant={variant}
            {...other}
        >
            {React.cloneElement(
                icon,
                { size: size })
            }
        </IconButtonRoot>
    )
}
