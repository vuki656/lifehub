import {
    ThemeProvider as StyledThemeProvider,
    ThemeProviderComponent,
} from 'styled-components'

import type { Theme } from './theme.types'

export const ThemeProvider = StyledThemeProvider as ThemeProviderComponent<Theme, Theme>
