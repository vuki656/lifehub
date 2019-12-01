// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { List, Icon, Label, Grid, Popup } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import ReminderModal from "./ReminderModal/ReminderModal";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

// Redux Actions Imports
import { fetchReminderTags } from "../../../redux/actions/tagsActions";

class Reminder extends React.Component {
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
                this.setState({ reminderTagValues: tagValueHolder });
            });
    };

    // Render all active tags from reminder
    renderReminderTags = ({ reminderTagValues }) =>
        reminderTagValues.map(tag => (
            <Label
                key={tag.key}
                style={{ backgroundColor: tag.color }}
                className="reminder-list-item-tag"
            >
                {tag.text}
            </Label>
        ));

    // Calculates time left from selected day till reminder due date
    calculateTimeLeft = ({ currentDay, reminder }) => {
        // Calculate difference in millis
        let timeLeftMilis = moment.duration(
            moment(reminder.endDate).diff(moment(currentDay))
        );

        // Convert millis to days
        let timeLeftDays = parseInt(timeLeftMilis.asDays(), 10);

        // If reminder is due today, return "Today" else number of days
        return timeLeftDays === 0 ? "Today" : `${timeLeftDays} Days Left`;
    };

    handleModalOpen = () => {
        this.props.fetchReminderTags(this.state);
        this.setState({ modalOpen: true });
    };

    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    render() {
        const { reminder, modalOpen } = this.state;

        return (
            <List.Item className="reminder-list-item">
                <List.Content>
                    <Label className="reminder-list-time-left-tag">
                        {this.calculateTimeLeft(this.state)}
                    </Label>
                    <List.Header>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column floated="left" width={10}>
                                    <p className="reminder-list-item-text">
                                        {reminder.text}
                                    </p>
                                </Grid.Column>
                                <Grid.Column
                                    floated="right"
                                    width={6}
                                    className="reminder-list-item-icons"
                                >
                                    <Icon
                                        name={"edit"}
                                        link={true}
                                        onClick={this.handleModalOpen}
                                    />

                                    <Popup
                                        className="border-radius-0"
                                        basic
                                        trigger={
                                            <Icon name={"eye"} link={true} />
                                        }
                                        content={
                                            <div>
                                                <p className="subtitle">
                                                    {reminder.text}
                                                </p>
                                                <p>{reminder.description}</p>
                                            </div>
                                        }
                                        on={["hover", "click"]}
                                    />

                                    <Icon
                                        name={"remove"}
                                        link={true}
                                        onClick={() =>
                                            this.removeReminder(this.state)
                                        }
                                    />

                                    <ReminderModal
                                        reminder={reminder}
                                        modalOpen={modalOpen}
                                        closeModal={this.closeModal}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Header>
                </List.Content>
                {this.renderReminderTags(this.state)}
            </List.Item>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    tagList: state.tags.tagList,
    reminderTags: state.tags.reminderTags
});

export default connect(mapStateToProps, { fetchReminderTags })(Reminder);
