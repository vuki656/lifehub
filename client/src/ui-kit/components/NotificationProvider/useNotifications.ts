import * as React from "react"

import { NotificationContext } from "./NotificationProvider"
import { NotificationContextType } from "./NotificationProvider.types"

export const useNotifications = (): NotificationContextType => {
    const context = React.useContext(NotificationContext)

    if (!context) {
        throw new Error(
            'No NotificationProvider context instance can be found. Please ensure that' +
            'you have called `NotificationProvider` higher up in your tree.',
        )
    }

    return context
}
