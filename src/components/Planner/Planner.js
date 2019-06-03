import React from "react";

import { Grid } from "semantic-ui-react";

import TaskArea from "./TaskArea";
import Reminders from "./Reminders";
import DaysListSidebar from "./DaysListSidebar";

class Planner extends React.Component {
    state = {
        regDate: null
    };

    // Fetches weight data from firebase
    fetchRegDate = () => {
        const { currentUser, usersRef } = this.state;

        usersRef.child(currentUser.uid).once("value", snapshot => {
            let regDate = snapshot.val().regDate; // THIS
            this.setState({ regDate });
            console.log(this.state.regDate);
        });

        this.generateDays(this.state);
    };

    render() {
        const { regDate } = this.state;

        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3} className="sidebar-menu">
                            <DaysListSidebar regDate={regDate} />
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
