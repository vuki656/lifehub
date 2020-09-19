import React from 'react'

import { IconColorType } from '../../styles'

export type IconBaseProps = React.SVGAttributes<SVGElement> & {
    color?: IconColorType,
}
