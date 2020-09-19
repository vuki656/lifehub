import React from 'react'
import styled, { CSSObject } from 'styled-components'

import {
    Theme,
    VariantType,
} from '../../styles'

type ButtonRootTypes =
    React.ButtonHTMLAttributes<HTMLButtonElement>
    & {
    variant: VariantType,
    fullWidth: boolean,
}

type ButtonIconTypes = React.HTMLAttributes<HTMLDivElement> & {
    position: 'start' | 'end',
}

const getButtonStyles = (
    theme: Theme,
    variant: VariantType,
) => {
    let styles: CSSObject = {}

    if (variant === 'primary') {
        styles = {
            backgroundColor: theme.palette.accents.blue,
            border: 'none',
            color: theme.palette.neutrals.white,
        }
    }

    return styles
}

export const ButtonRoot = styled('button')<ButtonRootTypes>((props) => ({
    ...getButtonStyles(props.theme, props.variant),
    ...props.theme.typography.regular,
    '&:focus': { outline: 'none' },
    '&:hover': {
        backgroundColor: props.theme.palette.accents.blueDark,
        cursor: 'pointer',
    },
    alignItems: 'center',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    height: '30px',
    justifyContent: 'center',
    minWidth: '64px',
    width: props.fullWidth
        ? '100%'
        : 'fit-content',
}))

export const ButtonIconWrapper = styled('div')<ButtonIconTypes>((props) => ({
    display: 'flex',
    marginLeft: props.position === 'end' && props.theme.spacing.xxs,
    marginRight: props.position === 'start' && props.theme.spacing.xxs,
}))
