import React from "react"

export type DrawerIconButtonProps = React.HTMLAttributes<HTMLDivElement> & {
    icon: React.ReactElement,
    tooltipText?: string,
    selected?: boolean,
    onClick?(): void,
}
