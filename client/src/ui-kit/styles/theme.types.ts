import type { Palette } from './palette'
import type { Sizing } from './sizing'
import { Spacing } from './spacing'
import { Transitions } from './transition'
import type { Typography } from './typography'
import type { ZIndex } from './zIndex'

export type Theme = {
    sizing: Sizing,
    palette: Palette,
    typography: Typography,
    zIndex: ZIndex,
    spacing: Spacing,
    transitions: Transitions,
}

export type SpacingType =
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'

export type ButtonVariantType =
    | 'primary'
    | 'outlined'
    | 'blank'

export type IconSizeType =
    | 'small'
    | 'medium'
    | 'big'

export type DrawerVariantType = 'mini'

export type NotificationVariantType =
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
