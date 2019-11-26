// Object Imports
import React from "react";
import moment from "moment";

// Destructured Imports
import { Grid, Typography } from "@material-ui/core";
import { connect } from "react-redux";

// Component Imports
import TodoCards from "./TodoCards/TodoCards";
import RemindersList from "./Reminders/RemindersList";

class TaskArea extends React.Component {
    state = {
        // Redux Props
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay
        };
    }

    render() {
        const { currentDay } = this.state;

        return (
            <Grid container>
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
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, null)(TaskArea);
