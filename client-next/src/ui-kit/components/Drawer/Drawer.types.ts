import React from "react"
import { DrawerVariantType } from "../../styles"

export type DrawerProps = React.HTMLAttributes<HTMLDivElement> & {
    variant: DrawerVariantType
}
