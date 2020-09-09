import { mixins } from './mixins'
import { palette } from './palette'
import type { Theme } from './theme.types'
import { typography } from './typography'
import { zIndex } from './zIndex'

export function createTheme(theme: Partial<Theme> = {}): Theme {
    return {
        mixins: {
            ...mixins,
            ...theme?.mixins,
        },
        palette: {
            ...palette,
            ...theme?.palette,
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
