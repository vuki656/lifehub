import { palette } from './palette'
import { sizing } from './sizing'
import { spacing } from './spacing'
import type { Theme } from './theme.types'
import { transition } from './transition'
import { typography } from './typography'
import { zIndex } from './zIndex'

export function createTheme(theme: Partial<Theme> = {}): Theme {
    return {
        palette: {
            ...palette,
            ...theme?.palette,
        },
        sizing: {
            ...sizing,
            ...theme?.sizing,
        },
        spacing: {
            ...spacing,
            ...theme.spacing,
        },
        transitions: {
            ...transition,
            ...theme.transitions,
        },
        typography: {
            ...typography,
            ...theme?.typography,
        },
        zIndex: {
            ...zIndex,
            ...theme?.zIndex,
        },
    }
}
