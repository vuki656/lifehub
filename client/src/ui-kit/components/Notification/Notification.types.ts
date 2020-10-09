import React from 'react'

import { NotificationVariantType } from '../../styles'

export type NotificationProps = React.HTMLAttributes<HTMLDivElement> & {
    variant: NotificationVariantType
}

export type NotificationType = {
    id: string,
    variant: NotificationVariantType,
    message: string,
}
