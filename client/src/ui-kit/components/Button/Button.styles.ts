import React from 'react'
import styled, {
    CSSObject,
    keyframes,
} from 'styled-components'

import {
    ButtonVariantType,
    Theme,
} from '../../styles'

type ButtonRootTypes =
    React.ButtonHTMLAttributes<HTMLButtonElement>
    & {
    variant: ButtonVariantType,
    fullWidth: boolean,
}

type ButtonIconTypes =
    React.HTMLAttributes<HTMLDivElement>
    & {
    position: 'start' | 'end',
}

export const getButtonStyles = (
    theme: Theme,
    variant: ButtonVariantType,
) => {
    let styles: CSSObject = { border: 'none' }

    if (variant === 'primary') {
        styles = {
            ...styles,
            '&:hover': {
                backgroundColor: theme.palette.blue.dark,
                cursor: 'pointer',
            },
            backgroundColor: theme.palette.blue.main,
            border: 'none',
            color: theme.palette.white,
            fontWeight: 'bold',
            transition: theme.transitions.create('background-color', 300),
        }
    }

    if (variant === 'outlined') {
        styles = {
            ...styles,
            '&:hover': {
                backgroundColor: theme.palette.grey.light500,
                cursor: 'pointer',
            },
            backgroundColor: theme.palette.white,
            borderColor: theme.palette.grey.light350,
            borderRadius: '4px',
            borderStyle: 'solid',
            borderWidth: '1px',
            transition: theme.transitions.create('background-color', 300),
        }
    }

    if (variant === 'blank') {
        styles = {
            ...styles,
            backgroundColor: 'transparent',
            cursor: 'pointer',
        }
    }

    return styles
}

export const ButtonRoot = styled('button')<ButtonRootTypes>((props) => ({
    ...props.theme.typography.regular,
    '&:focus': { outline: 'none' },
    alignItems: 'center',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    height: '30px',
    justifyContent: 'center',
    minWidth: '64px',
    padding: `0 ${props.theme.spacing.def}`,
    width: props.fullWidth ?
        '100%' :
        'fit-content',
    ...getButtonStyles(props.theme, props.variant),
}))

export const ButtonIconWrapper = styled('div')<ButtonIconTypes>((props) => ({
    display: 'flex',
    marginLeft: props.position === 'end' && props.theme.spacing.xs,
    marginRight: props.position === 'start' && props.theme.spacing.xs,
}))

const rotateAnimation = keyframes({ '100%': { transform: 'rotate(360deg)' } })

export const Loader = styled.div`
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 100%;
    width: 17px;
    height: 17px;
    animation: ${rotateAnimation} 0.7s linear infinite;
`
