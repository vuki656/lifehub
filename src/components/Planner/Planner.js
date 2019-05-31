import React from "react";

import { Grid } from "semantic-ui-react";

import TaskArea from "./TaskArea";
import Reminders from "./Reminders";
import DaysList from "./DaysList";

class Planner extends React.Component {
    state = {};

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3} className="sidebar-menu">
                        <DaysList />
                    </Grid.Column>
                    <Grid.Column width={10} className="task-area">
                        <TaskArea />
                    </Grid.Column>
                    <Grid.Column width={3} className="sidebar-menu">
                        <Reminders />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default Planner;
