// Other Imports
import React from "react";
import { connect } from "react-redux";
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
// Component Imports
import Cards from "./Cards/Cards";
import RemindersList from "./Reminders/RemindersList";
import { PlannerTopBar } from "./PlannerTopBar";

const PlannerMain = (props) => {
    const { currentDay } = props;

    return (
        <Grid container>
            <Grid xs={12} item className="planner__main__topbar">
                <PlannerTopBar currentDay={currentDay} />
            </Grid>
            <Grid container className="planner__main">
                <Grid xs={10} item className="planner__main__todos">
                    <Cards />
                </Grid>
                <Grid xs={2} item className="planner__main__reminders">
                    <RemindersList />
                </Grid>
            </Grid>
        </Grid>
    );
};

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, null)(PlannerMain);
