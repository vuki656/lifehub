import * as React from 'react'

import { Button } from '../../ui-kit/components/Button'
import { Dialog } from '../../ui-kit/components/Dialog'
import { DialogActions } from '../../ui-kit/components/DialogActions'

import { DeleteDialogProps } from './DeleteDialog.types'

export const DeleteDialog: React.FunctionComponent<DeleteDialogProps> = (props) => {
    const {
        name,
        onDelete,
        loading,
        isOpen,
        toggleDialog,
    } = props

    return (
        <Dialog
            isOpen={isOpen}
            title={`🗑 Delete ${name}`}
        >
            <DialogActions>
                <Button
                    onClick={toggleDialog}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    loading={loading}
                    onClick={onDelete}
                    variant="primary"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}
