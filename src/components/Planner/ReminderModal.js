import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import firebase from "../../firebase/Auth";
import uuidv4 from "uuid/v4";

import { Grid, Modal, Input, Button } from "semantic-ui-react";

class ReminderModal extends React.Component {
    state = {
        startDate: moment().toDate(),
        endDate: null,
        modalOpen: false,
        reminder: "",
        reminderRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser
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
                // Convert start date to day only timestamp
                let dayTimestamp = moment(
                    moment(_startDate).startOf("day")
                ).valueOf();

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

    render() {
        const { startDate, modalOpen, endDate } = this.state;

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

export default ReminderModal;
