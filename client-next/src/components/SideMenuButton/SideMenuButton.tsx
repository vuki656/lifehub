import Link from "next/link"
import * as React from 'react'
import { SideMenuButtonProps } from "./SideMenuButton.types"

export const SideMenuButton: React.FunctionComponent<SideMenuButtonProps> = (props) => {
    const {
        href,
        component,
        ...other
    } = props

    return (
        <Link href={href} {...other}>
            <a style={{ width: '100%' }}>
                {component}
            </a>
        </Link>
    )
}
