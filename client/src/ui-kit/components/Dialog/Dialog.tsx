import * as React from 'react'

import {
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogRoot,
    DialogTitle,
} from './Dialog.styles'
import { DialogProps } from './Dialog.types'

export const Dialog: React.FunctionComponent<DialogProps> = (props) => {
    const {
        children,
        isOpen,
        title,
        titleButton,
    } = props

    return (
        <>
            {isOpen ? (
                <DialogOverlay>
                    <DialogRoot>
                        <DialogHeader>
                            <DialogTitle>
                                {title}
                            </DialogTitle>
                            {titleButton}
                        </DialogHeader>
                        <DialogContent>
                            {children}
                        </DialogContent>
                    </DialogRoot>
                </DialogOverlay>
            ) : null}
        </>
    )
}
