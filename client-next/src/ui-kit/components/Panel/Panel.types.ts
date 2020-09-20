import React from 'react'

import { SpacingType } from '../../styles'

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    spacing: SpacingType,
}
