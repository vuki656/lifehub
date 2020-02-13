// Other Imports
import React, { useCallback } from "react"
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
// Component Imports
import { EditTodoCardDialog } from "../../../_Generic/Dialogs/EditTodoCardDialog";
// Icon Imports
import SettingsIcon from '@material-ui/icons/Settings';

export const CardItemTopBar = (props) => {
    const { todoCard } = props;

    const [isDialogOpen, toggleDialog] = React.useState(false);

    const handleDialogToggle = useCallback(
        () => {
            toggleDialog(!isDialogOpen);
        }, [isDialogOpen],
    );

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
        >
            <Grid item xs={10}>
                {todoCard.name}
            </Grid>
            <Grid
                item
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
                xs={2}
            >
                <SettingsIcon onClick={handleDialogToggle} />
                <EditTodoCardDialog isDialogOpen={isDialogOpen} handleDialogToggle={handleDialogToggle} />
            </Grid>
        </Grid>
    )
};
