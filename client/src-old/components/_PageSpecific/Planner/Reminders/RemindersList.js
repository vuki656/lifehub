// Object Imports
import React from "react";
import firebase from "../../../../helpers/firebase/Auth";
// Destructured Imports
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
// Icon Imports
import AddIcon from "@material-ui/icons/Add";
// Component Imports
import ReminderModal from "./ReminderModal/ReminderModal";
import Reminder from "./ReminderListItem";
// Redux Actions Imports
import { fetchReminderTags, fetchTags } from "../../../../helpers/redux/actions/tagsActions";

class Reminders extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            // Firebase
            currentUser: firebase.auth().currentUser,
            remindersRef: firebase.database().ref("reminders"),
            tagsRef: firebase.database().ref("reminder-tags"),

            // Base
            remindersList: [],
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
        this.props.fetchTags(this.state);
        this._isMounted = true;
        this.fetchReminders(this.state);
        this.activateListeners();
    }

    componentWillUnmount() {
        this.deactivateListeners();
        this._isMounted = false;
    }

    // Activate database listeners
    activateListeners = () => {
        this.activateSetReminderListener(this.state);
        this.activateRemoveReminderListener(this.state);
        this.activateChangeReminderListener(this.state);
    };

    // Deactivate database listeners
    deactivateListeners = () => {
        this.deactivateRemindersListener(this.state);
    };

    // Deactivate reminders ref listener
    deactivateRemindersListener = ({
        remindersRef,
        currentUser,
        currentDay
    }) => {
        remindersRef.child(`${currentUser.uid}/${currentDay}/`).off();
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
                    let tags = reminder.val().tags;
                    let description = reminder.val().description;

                    remindersHolder.push({
                        text,
                        key,
                        startDate,
                        endDate,
                        tags,
                        description
                    });
                });
            });

        this._isMounted && this.setState({ remindersList: remindersHolder });
    };

    // Listen for new reminder inputs and set to the state so component re-renders
    activateSetReminderListener({ currentUser, remindersRef, currentDay }) {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("child_added", () => {
                this.fetchReminders(this.state);
            });
    }

    // Listen for reminder deletions
    activateRemoveReminderListener = ({
        remindersRef,
        currentUser,
        currentDay
    }) => {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}`)
            .on("child_removed", () => {
                this.fetchReminders(this.state);
            });
    };

    // Listen for reminder deletions
    activateChangeReminderListener = ({
        remindersRef,
        currentUser,
        currentDay
    }) => {
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

    // Handle modal open
    handleModalOpen = () => {
        this.props.fetchReminderTags(this.state);
        this._isMounted && this.setState({ modalOpen: true });
    };

    // Handle modal close
    closeModal = () => {
        this._isMounted && this.setState({ modalOpen: false });
    };

    render() {
        const { modalOpen } = this.state;

        return (
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <Grid item xs={10}>
                    Reminders
                </Grid>
                <Grid item xs={2}>
                    <AddIcon onClick={this.handleModalOpen} />
                    <ReminderModal
                        modalOpen={modalOpen}
                        closeModal={this.closeModal}
                    />
                </Grid>
                <Grid item xs={12}>
                    {this.renderReminders(this.state)}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, { fetchTags, fetchReminderTags })(
    Reminders
);
