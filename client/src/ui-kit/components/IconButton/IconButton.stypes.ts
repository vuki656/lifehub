import React from 'react'
import styled from 'styled-components'

import { ButtonVariantType } from '../../styles'
import { getButtonStyles } from '../Button/Button.styles'

type IconButtonRoot = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant: ButtonVariantType
}

export const IconButtonRoot = styled('button')<IconButtonRoot>((props) => {
    let styles = {
        '&:focus': { outline: 'none' },
        ...getButtonStyles(props.theme, props.variant),
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: 0,
    }

    if (props.variant === 'outlined') {
        styles = {
            ...styles,
            padding: props.theme.spacing.xxs,
        }
    }

    return styles
})
