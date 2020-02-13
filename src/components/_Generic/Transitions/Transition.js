// Other Imports
import React from "react";
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

export const Transition = () => (
    <Grid
        container
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
    >
        <Grid item>
            <CircularProgress />
        </Grid>
    </Grid>
);
