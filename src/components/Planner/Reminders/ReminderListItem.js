// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Chip, Grid } from "@material-ui/core";
import { connect } from "react-redux";

// Component Imports
import ReminderModal from "./ReminderModal/ReminderModal";
import ViewReminderButton from "./Buttons/ViewReminderButton";

// Icon Imports
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

// Redux Actions Imports
import { fetchReminderTags } from "../../../redux/actions/tagsActions";

class Reminder extends React.Component {
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
            modalOpen: false,
            reminderTagValues: [],

            // Props
            reminder: this.props.reminder,

            // Redux Props
            currentDay: this.props.currentDay,
            tagList: this.props.tagList,
            reminderTags: this.props.reminderTags
        };

        this.closeModal = this.closeModal.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            reminder: props.reminder,
            currentDay: props.currentDay,
            reminderTags: props.reminderTags,
            tagList: props.tagList
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchReminderTagValues(this.state);
        this.activateListeners();
    }

    componentDidUpdate(prevProps) {
        if (this.props.tagList !== prevProps.tagList) {
            this.fetchReminderTagValues(this.state);
        }
    }

    componentWillUnmount() {
        this.deactivateListeners();
        this._isMounted = false;
    }

    // Activate database listeners
    activateListeners = () => {
        this.activateChangeTagListener(this.state);
        this.activateRemoveTagListener(this.state);
        this.activateSetTagListener(this.state);
    };

    // Deactivate database listeners
    deactivateListeners = () => {
        this.deactivateRemindersListener(this.state);
        this.deactivateTagsListener(this.state);
    };

    // Deactivate reminders ref listener
    deactivateRemindersListener = ({ remindersRef, currentUser }) => {
        remindersRef.child(`${currentUser.uid}`).off();
    };

    // Deactivate tags ref listener
    deactivateTagsListener = ({ tagsRef, currentUser }) => {
        tagsRef.child(`${currentUser.uid}`).off();
    };

    // Listen for new tag inputs
    activateSetTagListener({
        currentUser,
        remindersRef,
        currentDay,
        reminder
    }) {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags`)
            .on("child_added", () => {
                this.fetchReminderTagValues(this.state);
            });
    }

    // Listen for tag deletions
    activateRemoveTagListener = ({
        remindersRef,
        currentUser,
        currentDay,
        reminder
    }) => {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags`)
            .on("child_removed", () => {
                this.fetchReminderTagValues(this.state);
            });
    };

    // Listen for tag deletions
    activateChangeTagListener = ({
        remindersRef,
        currentUser,
        currentDay,
        reminder
    }) => {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags`)
            .on("child_changed", () => {
                this.fetchReminderTagValues(this.state);
            });
    };

    // Iterate trough days where reminder stored and remove it from each
    removeReminder = ({ currentUser, reminder, remindersRef }) => {
        let startDate = moment(reminder.startDate).toDate();
        let endDate = moment(reminder.endDate).toDate();

        for (
            let _startDate = moment(startDate);
            _startDate.isBefore(moment(endDate).add(1, "day"));
            _startDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(_startDate);

            remindersRef
                .child(`${currentUser.uid}/${dayTimestamp}/${reminder.key}`)
                .remove()
                .catch(error => console.error(error));
        }
    };

    // If tag is active, get its value and color
    fetchReminderTagValues = ({
        currentUser,
        remindersRef,
        currentDay,
        reminder,
        tagList
    }) => {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags`)
            .once("value", tags => {
                let tagValueHolder = [];
                tags.forEach(tag => {
                    if (tag.val() === true) {
                        tagList.forEach(tagFromList => {
                            if (tag.key === tagFromList.key) {
                                tagValueHolder.push(tagFromList);
                            }
                        });
                    }
                });
                this._isMounted &&
                    this.setState({ reminderTagValues: tagValueHolder });
            });
    };

    // Render all active tags from reminder
    renderReminderTags = ({ reminderTagValues }) =>
        reminderTagValues.map(tag => (
            <Chip
                size="small"
                label={tag.text}
                key={tag.key}
                style={{ backgroundColor: tag.color }}
            />
        ));

    // Calculates time left from selected day till reminder due date
    calculateTimeLeft = ({ currentDay, reminder }) => {
        // Calculate difference in milliseconds
        let timeLeftMilis = moment.duration(
            moment(reminder.endDate).diff(moment(currentDay))
        );

        // Convert milliseconds to days
        let timeLeftDays = parseInt(timeLeftMilis.asDays(), 10);

        // If reminder is due today, return "Today" else number of days
        return timeLeftDays === 0 ? "Today" : `${timeLeftDays} Days Left`;
    };

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
        const { reminder, modalOpen } = this.state;

        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item xs={12}>
                    {this.calculateTimeLeft(this.state)}
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={9}>
                        {reminder.text}
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        item
                        xs={3}
                    >
                        <EditIcon onClick={this.handleModalOpen} />
                        <DeleteIcon onClick={this.removeReminder} />
                        <ViewReminderButton reminder={reminder} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {this.renderReminderTags(this.state)}
                </Grid>
                <ReminderModal
                    reminder={reminder}
                    modalOpen={modalOpen}
                    closeModal={this.closeModal}
                />
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    tagList: state.tags.tagList,
    reminderTags: state.tags.reminderTags
});

export default connect(mapStateToProps, { fetchReminderTags })(Reminder);
