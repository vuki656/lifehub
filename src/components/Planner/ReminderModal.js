import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import firebase from "../../firebase/Auth";

import { Grid, Modal, Input, Button } from "semantic-ui-react";

class ReminderModal extends React.Component {
    state = {
        currentDay: moment().valueOf(),
        startDate: moment().toDate(),
        endDate: null,
        modalOpen: false,
        reminder: "",
        reminderRef: firebase.database().ref("reminders")
    };

    fetchReminder = () => {
        // Get all reminders whose due date is today or the future
        // Or just put the reminder in each day until due date and render that day on click
    };

    // Sends the reminder object to firebase
    sendReminderToFirebase = () => {
        // Save reminder in each day untill end date
        const { reminder, startDate, endDate, reminderRef } = this.state;
        for (
            let _startDate = moment(startDate);
            _startDate.isBefore(endDate);
            _startDate.add(1, "days")
        ) {
            // Convert start date to day only date
            let dayTimestamp = moment(
                moment(_startDate).startOf("day")
            ).valueOf();

            reminderRef
                .child(dayTimestamp)
                .push()
                .update({
                    reminder: reminder,
                    startDate: startDate,
                    endDate: endDate
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };

    // Set the state value from user input
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

    render() {
        const { startDate, modalOpen, endDate } = this.state;

        return (
            <React.Fragment>
                <Modal open={modalOpen}>
                    <Modal.Content>
                        <Grid>
                            <Grid.Row columns={"equal"}>
                                <Grid.Column>
                                    <p>Remind me about</p>
                                    <Input
                                        name="reminder"
                                        onChange={this.handleChange}
                                        placeholder="Marketing meeting"
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Start reminding me when</p>
                                    <DatePicker
                                        minDate={startDate}
                                        selected={startDate}
                                        dateFormat="dd/MM/yyyy"
                                        timeCaption="time"
                                        onChange={this.handleStartDate}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Remind untill</p>
                                    <DatePicker
                                        minDate={startDate}
                                        selected={endDate}
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
                                    <Button>Reset</Button>
                                    <Button secondary onClick={this.closeModal}>
                                        Discard
                                    </Button>
                                </Button.Group>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                </Modal>
                <Button onClick={this.openModal}>Add Reminder</Button>
            </React.Fragment>
        );
    }
}

export default ReminderModal;
