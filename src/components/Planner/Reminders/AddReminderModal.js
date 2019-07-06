// Object Imports
import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import firebase from "../../../firebase/Auth";
import uuidv4 from "uuid/v4";

// Destructured Imports
import { Grid, Modal, Input, Button } from "semantic-ui-react";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class AddReminderModal extends React.Component {
    state = {
        endDate: null,
        modalOpen: false,
        reminder: "",
        reminderRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,

        startDate: this.props.currentDay
    };

    // Sends the reminder object to firebase
    sendReminderToFirebase = () => {
        const { reminder, startDate, endDate } = this.state;

        // Generate a unique key for reminder thats the same in every day
        let key = uuidv4();

        if (reminder) {
            // Save reminder in each day untill end date
            for (
                let _startDate = moment(startDate);
                _startDate.isBefore(moment(endDate).add(1, "day"));
                _startDate.add(1, "days")
            ) {
                let dayTimestamp = getDayOnlyTimestamp(_startDate);

                this.createReminder(
                    this.state,
                    dayTimestamp,
                    key,
                    reminder,
                    startDate,
                    endDate
                );
            }
        }
        this.closeModal();
    };

    // Creates reminder in firebase
    createReminder = (
        { reminderRef, currentUser },
        dayTimestamp,
        key,
        reminder,
        startDate,
        endDate
    ) => {
        reminderRef
            .child(`${currentUser.uid}/${dayTimestamp}/${key}`)
            .update({
                key,
                reminder,
                startDate,
                endDate
            })
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
            return startDate;
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

    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    openModal = () => {
        this.setState({ modalOpen: true });
    };

    resetReminderFields = () => {
        this.setState({
            reminder: "",
            startDate: this.props.currentDay,
            endDate: ""
        });
    };

    render() {
        const { startDate, modalOpen, reminder } = this.state;

        return (
            <Modal
                open={modalOpen}
                trigger={<Button onClick={this.openModal}>Add Reminder</Button>}
            >
                <Modal.Content>
                    <Grid>
                        <Grid.Row columns={"equal"}>
                            <Grid.Column>
                                <p>Remind me about</p>
                                <Input
                                    name="reminder"
                                    onChange={this.handleChange}
                                    value={reminder}
                                    placeholder="Marketing meeting"
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Start reminding me when</p>
                                <DatePicker
                                    minDate={moment().toDate()}
                                    selected={this.getStartingDate()}
                                    dateFormat="dd/MM/yyyy"
                                    timeCaption="time"
                                    onChange={this.handleStartDate}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Remind untill</p>
                                <DatePicker
                                    minDate={startDate}
                                    selected={this.getEndingDate()}
                                    onChange={this.handleEndDate}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd/MM/yyyy hh:mm"
                                    timeCaption="time"
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Button.Group>
                                <Button
                                    primary
                                    onClick={this.sendReminderToFirebase}
                                >
                                    Save
                                </Button>
                                <Button onClick={this.resetReminderFields}>
                                    Reset
                                </Button>
                                <Button secondary onClick={this.closeModal}>
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

export default AddReminderModal;
