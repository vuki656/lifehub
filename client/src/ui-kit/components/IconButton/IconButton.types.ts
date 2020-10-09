import React from "react"

import {
    ButtonVariantType,
    IconSizeType,
} from "../../styles"

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactElement,
    variant?: ButtonVariantType
    size?: IconSizeType,
    loading?: boolean,
}
