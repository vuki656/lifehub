import React from "react";
import moment from "moment";

import { Grid, Header } from "semantic-ui-react";

import ReminderModal from "./ReminderModal";

class Reminders extends React.Component {
    state = {};

    renderReminders = () => {};

    render() {
        const { currentDay } = this.props;

        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row>
                        <Header>
                            {moment(currentDay).format("DD/MM/YYYY")}
                        </Header>
                        <ReminderModal currentDay={currentDay} />
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Reminders;
