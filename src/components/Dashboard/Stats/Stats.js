// Object Imports
import React from "react";

// Destructured Imports
import { Grid } from "@material-ui/core";

// Component Imports
import BestDayStreak from "./StatCards/BestDayStreak";
import CurrentDayStreak from "./StatCards/CurrentDayStreak";
import TotalCompletedTodos from "./StatCards/TotalCompletedTodos";
import TotalCompletedHabits from "./StatCards/TotalCompletedHabits";

const Stats = () => (
    <Grid container spacing={3}>
        <Grid item xs={3}>
            <CurrentDayStreak />
        </Grid>
        <Grid item xs={3}>
            <BestDayStreak />
        </Grid>
        <Grid item xs={3}>
            <TotalCompletedHabits />
        </Grid>
        <Grid item xs={3}>
            <TotalCompletedTodos />
        </Grid>
    </Grid>
);

export default Stats;
