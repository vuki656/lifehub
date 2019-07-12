// Object Imports
import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import firebase from "../../../../firebase/Auth";
import uuidv4 from "uuid/v4";

// Destructured Imports
import { Grid, Modal, Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import Tags from "./Tags/Tags";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../../helpers/Global";

// Redux Actions Imports
import { updateTagList } from "../../../../actions/tagsActions";

class ReminderModal extends React.Component {
    state = {
        endDate: null,
        text: "",
        reminderRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,

        reminder: this.props.reminder,
        modalOpen: this.props.modalOpen,

        // Redux Props
        startDate: this.props.currentDay,
        selectedTags: this.props.selectedTags
    };

    static getDerivedStateFromProps(props) {
        return {
            modalOpen: props.modalOpen,
            reminder: props.reminder,
            startDate: props.currentDay,
            selectedTags: props.selectedTags
        };
    }

    componentDidMount() {
        // If updating reminder, use its data
        if (this.props.reminder) {
            this.setExistingReminderState(this.props.reminder);
        }
    }

    // Set the existing reminder state
    setExistingReminderState = reminder => {
        this.setState({
            text: reminder.text,
            startDate: reminder.startDate,
            endDate: reminder.endDate,
            reminder: reminder,
            oldEndDate: reminder.endDate,
            oldStartDate: reminder.startDate
        });
    };

    // If reminder exists, update it, else create it
    handleReminderSave = () => {
        if (this.props.reminder) {
            this.handleReminderUpdate(this.state);
        } else {
            this.saveReminderToFirebase(this.state);
        }
        this.props.updateTagList();
    };

    handleReminderCancel = () => {
        this.props.updateTagList();
        this.props.closeModal();
    };

    // Sends the reminder object to firebase
    saveReminderToFirebase = ({ text, startDate, endDate, selectedTags }) => {
        // Generate a unique key for reminder thats
        // the same in every day its repeating
        let key = uuidv4();

        if (text) {
            // Save reminder in each day untill end date
            for (
                let _startDate = moment(startDate);
                _startDate.isBefore(moment(endDate).add(1, "day"));
                _startDate.add(1, "days")
            ) {
                let dayTimestamp = getDayOnlyTimestamp(_startDate);

                this.setReminder(
                    this.state,
                    text,
                    startDate,
                    endDate,
                    dayTimestamp,
                    key,
                    selectedTags
                );
            }
        }
        this.props.closeModal();
    };

    // Send reminder object to firebase
    handleReminderUpdate = ({
        startDate,
        endDate,
        text,
        oldStartDate,
        oldEndDate,
        reminder,
        selectedTags
    }) => {
        // Check if new start date is after old,
        // If yes, choose old to cover the whole range
        // So reminders before newStartDate can be deleted
        let itterationStartDate = moment(startDate).isAfter(oldStartDate)
            ? oldStartDate
            : startDate;

        // Check if new end date is before old,
        // If yes, choose old to cover the whole range
        // So reminders after newStartDate can be deleted
        let itterationEndDate = moment(endDate).isBefore(oldEndDate)
            ? oldEndDate
            : endDate;

        // Save new reminder in each day from date range
        // If there are days outside new day range
        // delete them, else update them
        for (
            let itterationDate = moment(itterationStartDate).subtract(1, "day");
            itterationDate.isBefore(moment(itterationEndDate).add(1, "day"));
            itterationDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(itterationDate);

            if (
                moment(itterationDate).isBetween(
                    moment(startDate).subtract(1, "day"),
                    moment(endDate).add(1, "day")
                )
            ) {
                this.setReminder(
                    this.state,
                    text,
                    startDate,
                    endDate,
                    dayTimestamp,
                    reminder.key,
                    selectedTags
                );
            } else {
                this.deleteReminder(this.state, dayTimestamp);
            }
        }
        this.props.closeModal();
    };

    // Update reminder in firebase
    setReminder = (
        { reminderRef, currentUser },
        text,
        startDate,
        endDate,
        dayTimestamp,
        key,
        selectedTags
    ) => {
        let tagList = this.formatTagList(selectedTags);

        reminderRef
            .child(`${currentUser.uid}/${dayTimestamp}/${key}`)
            .update({
                key,
                text,
                startDate,
                endDate,
                tags: tagList
            })
            .catch(err => {
                console.error(err);
            });
    };

    // Delete reminder from firebase
    deleteReminder = ({ reminderRef, currentUser, reminder }, dayTimestamp) => {
        reminderRef
            .child(`${currentUser.uid}/${dayTimestamp}/${reminder.key}`)
            .remove()
            .catch(err => {
                console.error(err);
            });
    };

    // Format the tag list into list of object with keys
    // So its saved in firebase as correct cata model
    formatTagList = selectedTags => {
        let _selectedTags = {};

        selectedTags.forEach(tag => {
            Object.assign(_selectedTags, {
                [tag.key]: { text: tag.text, color: tag.color, key: tag.key }
            });
        });

        return _selectedTags;
    };

    // Check if selected date is before today
    // If yes, use today
    // If no, use selected day's date
    getStartingDate = () => {
        const { startDate } = this.state;

        if (moment(startDate).isBefore(moment())) {
            return moment().toDate();
        } else {
            return moment(startDate).toDate();
        }
    };

    // Check if selelcted end date is before start date
    // If yes, return start date
    // If no, return end date
    getEndingDate = () => {
        const { startDate, endDate } = this.state;

        if (moment(endDate).isBefore(startDate)) {
            return startDate;
        } else {
            return endDate;
        }
    };

    // Set the state vale of reminder
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Save start date from calendar picker
    handleStartDate = startDate => {
        this.setState({ startDate: moment(startDate).valueOf() });
    };

    // Save end date from calendar picker
    handleEndDate = endDate => {
        this.setState({ endDate: moment(endDate).valueOf() });
    };

    render() {
        const { startDate, modalOpen, text, reminder } = this.state;

        return (
            <Modal open={modalOpen}>
                <Modal.Header>Customize Your Reminder</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Grid.Row>
                                    <p>Remind me about</p>
                                    <Input
                                        name="text"
                                        onChange={this.handleChange}
                                        value={text}
                                        placeholder="Marketing meeting"
                                    />
                                </Grid.Row>
                                <Grid.Row>
                                    <p>Start reminding me when</p>
                                    <DatePicker
                                        minDate={moment().toDate()}
                                        selected={this.getStartingDate()}
                                        dateFormat="dd/MM/yyyy"
                                        timeCaption="time"
                                        onChange={this.handleStartDate}
                                    />
                                </Grid.Row>
                                <Grid.Row>
                                    <p>Remind untill</p>
                                    <DatePicker
                                        minDate={moment(startDate).toDate()}
                                        selected={this.getEndingDate()}
                                        onChange={this.handleEndDate}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="dd/MM/yyyy hh:mm"
                                        timeCaption="time"
                                    />
                                </Grid.Row>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Grid.Row>
                                    <p>Set a Tag</p>
                                    <Tags reminder={reminder} />
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Button.Group>
                                <Button
                                    primary
                                    onClick={this.handleReminderSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    secondary
                                    onClick={this.handleReminderCancel}
                                >
                                    Cancel
                                </Button>
                            </Button.Group>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    selectedTags: state.tags.reminderTagList
});

export default connect(
    mapStateToProps,
    { updateTagList }
)(ReminderModal);
