import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export const EditTodoCardDialog = (props) => {
    const { handleDialogToggle, isDialogOpen } = props;

    return (
        <Dialog onClose={handleDialogToggle} open={isDialogOpen}>
            <DialogTitle onClose={handleDialogToggle}>
                Modal title
            </DialogTitle>
            <DialogContent>
                Content
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleDialogToggle} color="primary">
                    Save changes
                </Button>
            </DialogActions>
        </Dialog>
    )
};
