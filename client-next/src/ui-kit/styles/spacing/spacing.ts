/* eslint-disable sort-keys */

import { Spacing } from './spacing.types'

const spacingBase = '1em'

export const spacing: Spacing = {
    xxs: `calc(0.25 * ${spacingBase})`,
    xs: `calc(0.50 * ${spacingBase})`,
    sm: `calc(0.75 * ${spacingBase})`,
    def: '1em',
    md: `calc(1.25 * ${spacingBase})`,
    lg: `calc(2.00 * ${spacingBase})`,
    xl: `calc(3.25 * ${spacingBase})`,
    xxl: `calc(5.25 * ${spacingBase})`,
}
