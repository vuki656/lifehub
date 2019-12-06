// Object Imports
import React from "react";

// Destructured Imports
import { CircularProgress, Grid } from "@material-ui/core";

const LoadingPage = () => (
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

export default LoadingPage;
