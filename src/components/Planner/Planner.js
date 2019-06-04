import React from "react";

import { Grid } from "semantic-ui-react";

import TaskArea from "./TaskArea";
import Reminders from "./Reminders";
import DaysListSidebar from "./DaysListSidebar";

class Planner extends React.Component {
    state = {};

    render() {
        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3} className="sidebar-menu">
                            <DaysListSidebar />
                        </Grid.Column>
                        <Grid.Column width={10} className="task-area">
                            <TaskArea />
                        </Grid.Column>
                        <Grid.Column width={3} className="sidebar-menu">
                            <Reminders />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default Planner;
