// Object Imports
import React from "react";
import moment from "moment";

// Destructured Imports
import { Grid, Typography } from "@material-ui/core";

// Component Imports
import TodosForDay from "./TodosForDay/TodosForDay";
import TodosForDayCount from "../Global/TodosForDayCount";
import DashboardNotes from "./DashboardNotes/DashboardNotesList";
import AddDashboardNote from "./DashboardNotes/AddDashboardNote";
import Stats from "./Stats/Stats";

// Helper Imports
import { getDayOnlyTimestamp } from "../../helpers/Global";

const Dashboard = () => (
    <Grid container spacing={3}>
        <Stats />
        <Grid item xs={6}>
            <AddDashboardNote />
            <DashboardNotes />
        </Grid>
        <Grid item xs={6}>
            <Typography variant={"h5"}>
                Todos for today:{" "}
                <TodosForDayCount day={getDayOnlyTimestamp(moment())} />
            </Typography>
            <TodosForDay />
        </Grid>
    </Grid>
);

export default Dashboard;
