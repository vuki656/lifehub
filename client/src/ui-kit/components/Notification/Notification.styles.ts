import React from 'react'
import { animated } from 'react-spring'
import styled, { CSSObject } from 'styled-components'

import { WarningIcon } from '../../icons/WarningIcon'
import { NotificationVariantType } from '../../styles'

type NotificationRootProps = React.HTMLAttributes<HTMLDivElement> & {
    variant: NotificationVariantType
}

export const NotificationRoot = styled(animated.div as unknown as 'div')<NotificationRootProps>((props) => {
    let styles: CSSObject = {
        alignItems: 'center',
        borderRadius: '5px 0px 0px 5px',
        color: props.theme.palette.white,
        display: 'flex',
        margin: props.theme.spacing.def,
        marginRight: 0,
        padding: `${props.theme.spacing.xs} ${props.theme.spacing.md}`,
    }

    if (props.variant === 'error') {
        styles = {
            ...styles,
            backgroundColor: props.theme.palette.red.main,
        }
    } else if (props.variant === 'info') {
        styles = {
            ...styles,
            backgroundColor: props.theme.palette.blue.main,
        }
    } else if (props.variant === 'success') {
        styles = {
            ...styles,
            backgroundColor: props.theme.palette.green.main,
        }
    } else if (props.variant === 'warning') {
        styles = {
            ...styles,
            backgroundColor: props.theme.palette.yellow.main,
        }
    }

    return styles
})

export const NotificationErrorIcon = styled(WarningIcon)((props) => ({ fill: props.theme.palette.white }))

export const NotificationMessage = styled('p')((props) => ({
    fontSize: '15px',
    margin: `0 ${props.theme.spacing.def}`,
    maxWidth: '500px',
    minWidth: '300px',
}))

