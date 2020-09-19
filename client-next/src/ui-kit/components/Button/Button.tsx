import * as React from 'react'

import { Loader } from '../../../modules/Login/Login.styles'

import {
    ButtonIconWrapper,
    ButtonRoot,
} from './Button.styles'
import { ButtonProps } from './Button.types'

export const Button: React.FunctionComponent<ButtonProps> = (props) => {
    const {
        variant = 'primary',
        fullWidth = false,
        loading = false,
        disabled = false,
        children,
        startIcon,
        endIcon,
        ...other
    } = props

    return (
        <ButtonRoot
            variant={variant}
            fullWidth={fullWidth}
            disabled={loading || disabled}
            {...other}
        >
            {loading ? (
                <Loader />
            ) : (
                <>
                    <ButtonIconWrapper position='start'>
                        {startIcon}
                    </ButtonIconWrapper>
                    {children}
                    <ButtonIconWrapper position='end'>
                        {endIcon}
                    </ButtonIconWrapper>
                </>
            )}
        </ButtonRoot>
    )
}
