import { NotificationVariantType } from '../../styles'

export type NotificationContextType = {
    display(message: string, variant: NotificationVariantType): void
}
