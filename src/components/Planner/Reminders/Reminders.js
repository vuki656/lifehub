// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Grid, List, Button } from "semantic-ui-react";
import { connect } from "react-redux";

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

            // Redux Props
            currentDay: this.props.currentDay
        };

        this.closeModal = this.closeModal.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay
        };
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

    // Fetches reminders from firebase
    fetchReminders = ({ currentUser, remindersRef, currentDay }) => {
        let remindersHolder = [];

        remindersRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("value", reminders => {
                reminders.forEach(reminder => {
                    let key = reminder.val().key;
                    let text = reminder.val().text;
                    let startDate = reminder.val().startDate;
                    let endDate = reminder.val().endDate;
                    let reminderTags = this.getReminderTagList(
                        reminder.val().tags
                    );
                    remindersHolder.push({
                        text,
                        key,
                        startDate,
                        endDate,
                        reminderTags
                    });
                });
            });

        if (this._isMounted) {
            this.setState({ remindersList: remindersHolder });
        }
    };

    // Get all active tags in reminder
    getReminderTagList = tags => {
        let reminderTagsHolder = [];
        // Convert object of objects to array of objects
        // So it can be itterated over
        let arrOfTags = Object.values(tags ? tags : []);

        arrOfTags.forEach(tag => {
            let text = tag.text;
            let color = tag.color;
            let key = tag.key;

            reminderTagsHolder.push({ text, color, key });
        });

        return reminderTagsHolder;
    };

    // Listen for new reminder inputs and set to the state so component re-renders
    addSetReminderListener({ currentUser, remindersRef, currentDay }) {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}`)
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

    // Render reminders to the screen
    renderReminders = ({ remindersList }) =>
        remindersList.map(reminder => (
            <Reminder reminder={reminder} key={reminder.key} />
        ));

    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    openModal = () => {
        this.setState({ modalOpen: true });
    };

    render() {
        const { modalOpen } = this.state;

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
                            closeModal={this.closeModal}
                        />
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(
    mapStateToProps,
    null
)(Reminders);
