// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../../../../helpers/firebase/Auth";
import uuidv4 from "uuid/v4";
import DateFnsUtils from "@date-io/date-fns";

// Destructured Imports
import {
    Typography,
    Grid,
    Modal,
    TextField,
    Button,
    Paper
} from "@material-ui/core";
import { connect } from "react-redux";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

// Component Imports
import Tags from "./Tags/Tags";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../../../helpers/functions/Global";

class ReminderModal extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Props
        currentUser: firebase.auth().currentUser,
        tagsRef: firebase.database().ref("reminder-tags"),
        remindersRef: firebase.database().ref("reminders"),

        // Base
        endDate: null,
        text: "",
        description: "",
        error: "",

        // Props
        reminder: this.props.reminder,
        modalOpen: this.props.modalOpen,

        // Redux Props
        currentDay: this.props.currentDay,
        startDate: this.props.currentDay,
        reminderTags: this.props.reminderTags,
        tagList: this.props.tagList,
        generateUntillDate: this.props.generateUntillDate
    };

    static getDerivedStateFromProps(props) {
        return {
            modalOpen: props.modalOpen,
            reminder: props.reminder,
            startDate: props.currentDay,
            reminderTags: props.reminderTags,
            tagList: props.tagList,
            generateUntillDate: props.generateUntillDate
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.setExistingReminderState(this.props.reminder);
    }

    componentDidUpdate(prevProps) {
        if (this.props.modalOpen !== prevProps.modalOpen) {
            this.setExistingReminderState(this.props.reminder);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Set the existing reminder state
    setExistingReminderState = reminder => {
        if (reminder) {
            this._isMounted &&
                this.setState({
                    description: reminder.description,
                    text: reminder.text,
                    startDate: reminder.startDate,
                    endDate: reminder.endDate,
                    reminder: reminder,
                    oldEndDate: reminder.endDate,
                    oldStartDate: reminder.startDate
                });
        }
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
            this._isMounted &&
                this.setState({ error: "Please fill out all fields" });
        }
    };

    // Handle reminder cancel button press
    handleReminderCancel = () => {
        this.clearModalFields(this.state);
        this.props.closeModal();
    };

    // Set the modal fields to default value
    clearModalFields = () => {
        this._isMounted &&
            this.setState({
                text: "",
                startDate: this.props.currentDay,
                endDate: null,
                error: "",
                description: ""
            });
    };

    // Sends the reminder object to firebase
    saveReminderToFirebase = ({
        text,
        startDate,
        endDate,
        reminderTags,
        description
    }) => {
        // Generate a unique key for reminder thats
        // the same in every day its repeating
        let key = uuidv4();

        if (text) {
            // Save reminder in each day until end date
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
                    reminderTags,
                    description
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
        reminderTags,
        description
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
                    reminderTags,
                    description
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
        tagList,
        description
    ) => {
        remindersRef
            .child(`${currentUser.uid}/${dayTimestamp}/${key}`)
            .update({
                key,
                text,
                startDate,
                endDate,
                tags: tagList,
                description
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

    // Check if selected end date is before start date
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
        this._isMounted &&
            this.setState({ [event.target.name]: event.target.value });
    };

    // Save start date from calendar picker
    handleStartDateChange = startDate => {
        this._isMounted &&
            this.setState({ startDate: moment(startDate).valueOf() });
    };

    // Save end date from calendar picker
    handleEndDateChange = endDate => {
        this._isMounted &&
            this.setState({ endDate: moment(endDate).valueOf() });
    };

    render() {
        const {
            startDate,
            modalOpen,
            text,
            reminder,
            error,
            description
        } = this.state;

        return (
            <Modal open={modalOpen}>
                <Paper>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item xs={9}>
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="flex-start"
                            >
                                <Grid item xs={12}>
                                    <Typography variant="h5">
                                        Edit Reminder
                                    </Typography>
                                </Grid>
                                {error && (
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            {error}
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <Typography variant="h6">Title</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="text"
                                        label="Title"
                                        value={text}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        Description
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={description}
                                        name="description"
                                        label="Description"
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        Start reminding me when
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                    >
                                        <DatePicker
                                            autoOk
                                            label="Date"
                                            clearable
                                            disablePast
                                            value={this.getStartingDate()}
                                            onChange={
                                                this.handleStartDateChange
                                            }
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        Remind me until
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                    >
                                        <DatePicker
                                            autoOk
                                            label="Date"
                                            clearable
                                            minDate={moment(startDate).toDate()}
                                            disablePast
                                            value={this.getEndingDate()}
                                            onChange={this.handleEndDateChange}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="h5">Tags</Typography>
                            <Tags reminder={reminder} />
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleReminderSave}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.handleReminderCancel}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    generateUntillDate: state.planner.generateUntillDate,
    reminderTags: state.tags.reminderTags,
    tagList: state.tags.tagList
});

export default connect(mapStateToProps, null)(ReminderModal);
