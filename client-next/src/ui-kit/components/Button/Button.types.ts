import React from 'react'

import { ButtonVariantType } from '../../styles'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariantType,
    fullWidth?: boolean,
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    loading?: boolean,
}
