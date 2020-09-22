import * as React from 'react'
import { DrawerRoot } from "./Drawer.styles"
import { DrawerProps } from "./Drawer.types"

export const Drawer: React.FunctionComponent<DrawerProps> = (props) => {
    const {
        children,
        variant,
        ...other
    } = props

    return (
        <DrawerRoot variant={variant} {...other}>
            {children}
        </DrawerRoot>
    )
}
