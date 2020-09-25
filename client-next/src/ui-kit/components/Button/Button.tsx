import * as React from 'react'

import {
    ButtonIconWrapper,
    ButtonRoot,
    Loader,
} from './Button.styles'
import { ButtonProps } from './Button.types'

export const Button: React.FunctionComponent<ButtonProps> = (props) => {
    const {
        variant = 'primary',
        fullWidth = false,
        loading = false,
        disabled = false,
        children,
        type = "button",
        startIcon,
        endIcon,
        ...other
    } = props

    return (
        <ButtonRoot
            disabled={loading || disabled}
            fullWidth={fullWidth}
            type={type}
            variant={variant}
            {...other}
        >
            {loading ? (
                <Loader />
            ) : (
                <>
                    <ButtonIconWrapper position="start">
                        {startIcon}
                    </ButtonIconWrapper>
                    {children}
                    <ButtonIconWrapper position="end">
                        {endIcon}
                    </ButtonIconWrapper>
                </>
            )}
        </ButtonRoot>
    )
}
