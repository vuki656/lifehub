// Other Imports
import React from "react";
import { connect } from "react-redux";
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
// Component Imports
import TodoCards from "./TodoCards/TodoCards";
import RemindersList from "./Reminders/RemindersList";
import { PlannerMainTitle } from "./PlannerMainTitle";

const PlannerMain = (props) => {
    const { currentDay } = props;

    return (
        <Grid container>
            <Grid xs={12} item className="planner__title">
                <PlannerMainTitle currentDay={currentDay} />
            </Grid>
            <Grid container className="planner__main">
                <Grid xs={10} item className="planner__main__todos">
                    <TodoCards />
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
