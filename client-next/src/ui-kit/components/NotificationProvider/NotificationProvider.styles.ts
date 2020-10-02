import styled from "styled-components"

import {
    CheckIcon,
    InfoIcon,
    WarningIcon,
} from "../../icons/"

export const NotificationProviderRoot = styled('div')({
    position: 'absolute',
    right: 0,
})

export const NotificationErrorIcon = styled(WarningIcon)((props) => ({ fill: props.theme.palette.white }))

export const NotificationWarningIcon = styled(WarningIcon)((props) => ({ fill: props.theme.palette.white }))

export const NotificationInfoIcon = styled(InfoIcon)((props) => ({ fill: props.theme.palette.white }))

export const NotificationSuccessIcon = styled(CheckIcon)((props) => ({ fill: props.theme.palette.white }))
