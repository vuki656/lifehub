/* eslint-disable sort-keys */

import * as React from 'react'
import {
    config,
    useTransition,
} from "react-spring"

import { NotificationVariantType } from "../../styles"
import { Notification } from "../Notification"
import { NotificationType } from "../Notification/Notification.types"

import { NotificationProviderRoot } from "./NotificationProvider.styles"
import { NotificationContextType } from "./NotificationProvider.types"

export const NotificationContext = React.createContext<NotificationContextType | null>(null)

export const NotificationProvider: React.FunctionComponent = (props) => {
    const { children } = props

    const [
        notifications,
        setNotification,
    ] = React.useState<NotificationType[]>([])

    const renderNotifications = useTransition(notifications, {
        config: config.gentle,
        keys: notifications.map((item, index) => index),
        from: {
            opacity: 0,
            transform: "translate3d(100%, 0px, 0px)",
        },
        enter: {
            opacity: 1,
            transform: "translate3d(0%, 0px, 0px)",
        },
        leave: {
            opacity: 0,
            transform: "translate3d(100%, 0px, 0px)",
        },
    })

    const value = React.useMemo<NotificationContextType>(() => {
        return {
            display: (message: string, variant: NotificationVariantType) => {
                const id = String(Date.now() + Math.random())

                // Display notification
                setNotification((notifications) => {
                    const notificationDisplayed = notifications.some((notification) => {
                        return notification.message === message
                    })

                    if (notificationDisplayed) {
                        return notifications
                    }

                    return notifications.concat({
                        id: id,
                        message,
                        variant,
                    })
                })

                // Remove notification
                setTimeout(() => {
                    setNotification((notifications) => {
                        return notifications.filter((notification) => {
                            return notification.id !== id
                        })
                    })
                }, 3000)
            },
        }
    }, [])

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationProviderRoot>
                {renderNotifications((styles, notification) => {
                    return (
                        <Notification
                            // There is a type mismatch probably due to version being rc3
                            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                            // @ts-ignore
                            style={styles}
                            variant={notification.variant}
                        >
                            {notification.message}
                        </Notification>
                    )
                })}
            </NotificationProviderRoot>
        </NotificationContext.Provider>
    )
}
