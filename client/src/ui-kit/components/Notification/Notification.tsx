import * as React from 'react'

import {
    NotificationErrorIcon,
    NotificationInfoIcon,
    NotificationSuccessIcon,
    NotificationWarningIcon,
} from '../NotificationProvider/NotificationProvider.styles'

import {
    NotificationMessage,
    NotificationRoot,
} from './Notification.styles'
import { NotificationProps } from './Notification.types'

export const Notification: React.FunctionComponent<NotificationProps> = (props) => {
    const {
        children,
        style,
        variant,
        ...other
    } = props

    return (
        <NotificationRoot
            style={style}
            variant={variant}
            {...other}
        >
            {(() => {
                switch (props.variant) {
                    case 'error':
                        return <NotificationErrorIcon size="small" />
                    case 'info':
                        return <NotificationInfoIcon size="small" />
                    case 'success':
                        return <NotificationSuccessIcon size="small" />
                    case 'warning':
                        return <NotificationWarningIcon size="small" />
                }
            })()}
            <NotificationMessage>
                {children}
            </NotificationMessage>
        </NotificationRoot>
    )
}
