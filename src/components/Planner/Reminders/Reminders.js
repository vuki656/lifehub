// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Grid, List, Button } from "semantic-ui-react";

// Component Imports
import ReminderModal from "./ReminderModal";
import Reminder from "./Reminder";

class Reminders extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            remindersList: [],
            remindersRef: firebase.database().ref("reminders"),
            currentUser: firebase.auth().currentUser,
            modalOpen: false,

            currentDay: this.props.currentDay
        };

        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchReminders(this.state);
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners(this.state);
        this._isMounted = false;
    }

    // Turn off db connections
    removeListeners = ({ remindersRef, currentUser, currentDay }) => {
        remindersRef.child(`${currentUser.uid}/${currentDay}/`).off();
    };

    // Listen for db changes
    addListeners = () => {
        this.addSetReminderListener(this.state);
        this.addRemoveReminderListener(this.state);
        this.addChangeReminderListener(this.state);
    };

    // Listen for new reminder inputs and set to the state so component re-renders
    addSetReminderListener({
        currentUser,
        remindersRef,
        currentDay,
        category
    }) {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/categories/${category}`)
            .on("child_added", () => {
                this.fetchReminders(this.state);
            });
    }

    // Listen for reminder deletions
    addRemoveReminderListener = ({ remindersRef, currentUser, currentDay }) => {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("child_removed", () => {
                this.fetchReminders(this.state);
            });
    };

    // Listen for reminder deletions
    addChangeReminderListener = ({ remindersRef, currentUser, currentDay }) => {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("child_changed", () => {
                this.fetchReminders(this.state);
            });
    };

    // Fetches reminders from firebase
    fetchReminders = ({ currentUser, remindersRef, currentDay }) => {
        let remindersHolder = [];

        remindersRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("value", snapshot => {
                snapshot.forEach(child => {
                    let key = child.val().key;
                    let text = child.val().text;
                    let startDate = child.val().startDate;
                    let endDate = child.val().endDate;
                    remindersHolder.push({ text, key, startDate, endDate });
                });
            });

        if (this._isMounted) {
            this.setState({ remindersList: remindersHolder });
        }
    };

    // Render reminders to the screen
    renderReminders = ({ remindersList, currentDay }) => {
        return remindersList.map(reminder => (
            <Reminder
                reminder={reminder}
                key={reminder.key}
                currentDay={currentDay}
            />
        ));
    };

    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    openModal = () => {
        this.setState({ modalOpen: true });
    };

    render() {
        const { currentDay, modalOpen } = this.state;

        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row>
                        <Button onClick={this.openModal}>Add Reminder</Button>
                    </Grid.Row>
                    <Grid.Row>
                        <List>{this.renderReminders(this.state)}</List>
                    </Grid.Row>
                    <Grid.Row>
                        <ReminderModal
                            modalOpen={modalOpen}
                            currentDay={currentDay}
                            closeModal={this.closeModal}
                        />
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Reminders;
