import React from 'react'

import { VariantType } from '../../styles'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: VariantType,
    fullWidth?: boolean,
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    loading?: boolean,
}
