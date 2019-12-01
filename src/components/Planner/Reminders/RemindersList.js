// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Grid, List, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import ReminderModal from "./ReminderModal/ReminderModal";
import Reminder from "./ReminderListItem";

// Redux Actions Imports
import {
    fetchTags,
    fetchReminderTags
} from "../../../redux/actions/tagsActions";

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
            <Grid className="mar-all-0">
                <Grid.Column className="pad-all-0">
                    <Grid.Row>
                        <Grid className="reminder-section">
                            <Grid.Row className="reminders-title">
                                <Grid.Column floated="left" width={11}>
                                    Reminders
                                </Grid.Column>
                                <Grid.Column floated="right" width={5}>
                                    <Icon
                                        className="add-reminder-icon"
                                        name="add"
                                        onClick={this.handleModalOpen}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    <Grid.Row className="reminder-list">
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

export default connect(mapStateToProps, { fetchTags, fetchReminderTags })(
    Reminders
);
