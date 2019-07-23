// Object Imports
import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import firebase from "../../../../firebase/Auth";
import uuidv4 from "uuid/v4";

// Destructured Imports
import { Grid, Modal, Input, Button, Message } from "semantic-ui-react";
import { connect } from "react-redux";

// Component Imports
import Tags from "./Tags/Tags";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../../helpers/Global";

class ReminderModal extends React.Component {
    state = {
        tagsRef: firebase.database().ref("reminder-tags"),
        remindersRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,
        endDate: null,
        text: "",
        error: "",

        reminder: this.props.reminder,
        modalOpen: this.props.modalOpen,

        // Redux Props
        currentDay: this.props.currentDay,
        startDate: this.props.currentDay,
        reminderTags: this.props.reminderTags,
        tagList: this.props.tagList
    };

    static getDerivedStateFromProps(props) {
        return {
            modalOpen: props.modalOpen,
            reminder: props.reminder,
            startDate: props.currentDay,
            reminderTags: props.reminderTags,
            tagList: props.tagList
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
        const { endDate, text } = this.state;

        // Check if end date and text set before saving
        if (endDate && text) {
            if (this.props.reminder) {
                this.handleReminderUpdate(this.state);
            } else {
                this.saveReminderToFirebase(this.state);
            }
            this.clearModalFields(this.state);
        } else {
            this.setState({ error: "Please fill out all fields" });
        }
    };

    handleReminderCancel = () => {
        this.clearModalFields(this.state);
        this.props.closeModal();
    };

    clearModalFields = () => {
        this.setState({
            text: "",
            startDate: this.props.currentDay,
            endDate: null,
            error: ""
        });
    };

    // Sends the reminder object to firebase
    saveReminderToFirebase = ({ text, startDate, endDate, reminderTags }) => {
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
                    reminderTags
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
        reminderTags
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
                    reminderTags
                );
            } else {
                this.deleteReminder(this.state, dayTimestamp);
            }
        }
        this.props.closeModal();
    };

    // Update reminder in firebase
    setReminder = (
        { remindersRef, currentUser },
        text,
        startDate,
        endDate,
        dayTimestamp,
        key,
        tagList
    ) => {
        remindersRef
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
    deleteReminder = (
        { remindersRef, currentUser, reminder },
        dayTimestamp
    ) => {
        remindersRef
            .child(`${currentUser.uid}/${dayTimestamp}/${reminder.key}`)
            .remove()
            .catch(err => {
                console.error(err);
            });
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
    handleStartDateChange = startDate => {
        this.setState({ startDate: moment(startDate).valueOf() });
    };

    // Save end date from calendar picker
    handleEndDateChange = endDate => {
        this.setState({ endDate: moment(endDate).valueOf() });
    };

    render() {
        const { startDate, modalOpen, text, reminder, error } = this.state;

        return (
            <Modal open={modalOpen}>
                <Modal.Header>Customize Your Reminder</Modal.Header>
                <Modal.Content>
                    <Grid>
                        {error && (
                            <Grid.Row>
                                <Message error header="Error" content={error} />
                            </Grid.Row>
                        )}
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Grid.Row>
                                    <p>Remind me about</p>
                                    <Input
                                        name="text"
                                        onChange={this.handleChange}
                                        value={text}
                                        required
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
                                        onChange={this.handleStartDateChange}
                                    />
                                </Grid.Row>
                                <Grid.Row>
                                    <p>Remind untill</p>
                                    <DatePicker
                                        minDate={moment(startDate).toDate()}
                                        selected={this.getEndingDate()}
                                        onChange={this.handleEndDateChange}
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
    reminderTags: state.tags.reminderTags,
    tagList: state.tags.tagList
});

export default connect(
    mapStateToProps,
    null
)(ReminderModal);
