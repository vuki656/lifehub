import * as React from 'react'
import { DialogActionsRoot } from "./DialogActions.styles"

export const DialogActions: React.FunctionComponent = (props) => {
    const { children } = props

    return (
        <DialogActionsRoot>
            {children}
        </DialogActionsRoot>
    )
}
