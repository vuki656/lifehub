import React from "react";
import firebase from "../../firebase/Auth";

import { Grid, List } from "semantic-ui-react";

import ReminderModal from "./ReminderModal";
import Reminder from "./Reminder";

class Reminders extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        remindersList: [],
        remindersRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,

        currentDay: this.props.currentDay
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchReminders(this.state);
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
        this._isMounted = false;
    }

    // Turn off db connections
    removeListeners = () => {
        const { remindersRef, currentUser, currentDay } = this.state;

        remindersRef.child(`${currentUser.uid}/${currentDay}/`).off();
    };

    // Listen for db changes
    addListeners = () => {
        this.addSetReminderListener(this.state);
    };

    // Listen for new reminder inputs and set to the state so component re-renders
    addSetReminderListener({
        currentUser,
        remindersRef,
        currentDay,
        category
    }) {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/${[category]}`)
            .on("child_added", () => {
                this.fetchReminders(this.state);
            });
    }

    // Fetches reminders from firebase
    fetchReminders = ({ currentUser, remindersRef, currentDay }) => {
        let remindersHolder = [];

        remindersRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("value", snapshot => {
                snapshot.forEach(child => {
                    let key = child.val().key;
                    let reminder = child.val().reminder;
                    remindersHolder.push({ reminder, key });
                });
            });

        if (this._isMounted) {
            this.setState({ remindersList: remindersHolder });
        }
    };

    // Render reminders to the screen
    renderReminders = ({ remindersList }) =>
        remindersList.map(reminder => (
            <Reminder reminder={reminder} key={reminder.key} />
        ));

    render() {
        const { currentDay } = this.props;

        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row>
                        <List>{this.renderReminders(this.state)}</List>
                    </Grid.Row>
                    <Grid.Row>
                        <ReminderModal currentDay={currentDay} />
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Reminders;
