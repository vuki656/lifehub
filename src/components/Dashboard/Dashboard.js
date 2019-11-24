// Object Imports
import React from "react";

// Destructured Imports
import { Grid } from "@material-ui/core";

// Component Imports
import TodosForDay from "./TodosForDay/TodosForDay";
import DashboardNotes from "./DashboardNotes/DashboardNotes";
import Stats from "./Stats/Stats";

const Dashboard = () => (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Stats />
        </Grid>
        <Grid item xs={6}>
            <DashboardNotes />
        </Grid>
        <Grid item xs={6}>
            <TodosForDay />
        </Grid>
    </Grid>
);

export default Dashboard;
