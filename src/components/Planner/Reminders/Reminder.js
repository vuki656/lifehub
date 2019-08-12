// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { List, Icon, Label } from "semantic-ui-react";
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
            remindersRef: firebase.database().ref("reminders"),
            tagsRef: firebase.database().ref("reminder-tags"),
            currentUser: firebase.auth().currentUser,
            modalOpen: false,
            reminderTagValues: [],

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
        this.fetchReminderTagValues(this.state);
        this.addListeners();
    }

    componentDidUpdate(prevProps) {
        if (this.props.tagList !== prevProps.tagList) {
            this.fetchReminderTagValues(this.state);
        }
    }

    addListeners = () => {
        this.addChangeTagListener(this.state);
        this.addRemoveTagListener(this.state);
        this.addSetTagListener(this.state);
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

    // Listen for new tag inputs
    addSetTagListener({ currentUser, remindersRef, currentDay, reminder }) {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags`)
            .on("child_added", () => {
                this.fetchReminderTagValues(this.state);
            });
    }

    // Listen for tag deletions
    addRemoveTagListener = ({
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
    addChangeTagListener = ({
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

    // Render all active tags from reminder
    renderReminderTags = ({ reminderTagValues }) =>
        reminderTagValues.map(tag => (
            <Label key={tag.key} style={{ backgroundColor: tag.color }}>
                {tag.text}
            </Label>
        ));

    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    handleModalOpen = () => {
        this.props.fetchReminderTags(this.state);
        this.setState({ modalOpen: true });
    };

    render() {
        const { reminder, modalOpen } = this.state;

        return (
            <List.Item className="reminder-list-item">
                <List.Icon
                    name="calendar outline"
                    size="large"
                    verticalAlign="middle"
                />
                <List.Content>
                    <List.Header>
                        {reminder.text}
                        <Icon
                            name={"remove"}
                            link={true}
                            onClick={() => this.removeReminder(this.state)}
                        />
                        <Icon
                            name={"pencil"}
                            link={true}
                            onClick={this.handleModalOpen}
                        />
                        <ReminderModal
                            reminder={reminder}
                            modalOpen={modalOpen}
                            closeModal={this.closeModal}
                        />
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

export default connect(
    mapStateToProps,
    { fetchReminderTags }
)(Reminder);
