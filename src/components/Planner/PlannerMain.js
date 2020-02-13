// Other Imports
import React from "react";
import moment from "moment";
import { connect } from "react-redux";
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Component Imports
import TodoCards from "./TodoCards/TodoCards";
import RemindersList from "./Reminders/RemindersList";

const PlannerMain = (props) => {
    const { currentDay } = props;

    return (
        <Grid container className="planner__main">
            <Grid xs={12} item>
                <Typography variant="h4">
                    {moment(currentDay).format("DD/MM/YYYY - dddd")}
                </Typography>
            </Grid>
            <Grid xs={10} item>
                <TodoCards />
            </Grid>
            <Grid xs={2} item>
                <RemindersList />
            </Grid>
        </Grid>
    );
};

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, null)(PlannerMain);
