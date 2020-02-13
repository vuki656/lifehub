// Other Imports Imports
import React from "react";
import Grid from "@material-ui/core/Grid";
// Component Imports
import TodosForDay from "./_PageSpecific/Dashboard/TodosForDay/TodosForDay";
import Stats from "./_PageSpecific/Dashboard/Stats/Stats";

const Dashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Stats />
        </Grid>
        <Grid item xs={12}>
            <TodosForDay />
        </Grid>
    </Grid>
);

export default Dashboard;
