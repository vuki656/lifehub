import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import firebase from "../../firebase/Auth";

import { Grid, Modal, Input, Button, Icon } from "semantic-ui-react";

class UpdateReminderModal extends React.Component {
    state = {
        modalOpen: false,
        reminderRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,
        reminderText: "",

        originalEndDate: this.props.reminder.endDate,
        dateToCheckFrom: this.props.reminder.startDate,
        startDate: moment(this.props.reminder.startDate).toDate(),
        endDate: moment(this.props.reminder.endDate).toDate(),
        reminder: this.props.reminder
    };

    // Get parent props -> causes re-render
    static getDerivedStateFromProps(props) {
        return {
            modalOpen: props.modalOpen
        };
    }

    // Sends the reminder object to firebase
    sendReminderToFirebase = () => {
        const {
            reminder,
            startDate,
            endDate,
            reminderRef,
            currentUser,
            reminderText,
            dateToCheckFrom,
            originalEndDate
        } = this.state;

        let _endDate;

        // Check if the new date is before the original date
        // If yes use the original date so the loop can conver
        // days after it and delete them
        if (moment(endDate).isBefore(originalEndDate)) {
            _endDate = originalEndDate;
        } else {
            _endDate = endDate;
        }

        // Save reminder in each day untill end date
        for (
            let _startDate = moment(dateToCheckFrom);
            _startDate.isBefore(_endDate);
            _startDate.add(1, "days")
        ) {
            // Convert start date to day only timestamp
            let dayTimestamp = moment(
                moment(_startDate).startOf("day")
            ).valueOf();

            if (
                moment(_startDate).isBetween(
                    moment(startDate).subtract(1, "day"),
                    moment(endDate).add(1, "day")
                )
            ) {
                reminderRef
                    .child(`${currentUser.uid}/${dayTimestamp}/${reminder.key}`)
                    .update({
                        reminder: reminderText,
                        startDate,
                        endDate,
                        key: reminder.key
                    })
                    .catch(err => {
                        console.error(err);
                    });
            } else {
                reminderRef
                    .child(`${currentUser.uid}/${dayTimestamp}/${reminder.key}`)
                    .remove()

                    .catch(err => {
                        console.error(err);
                    });
            }
        }

        this.closeModal();
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
        const { reminder, modalOpen, startDate, endDate } = this.state;

        return (
            <Modal
                open={modalOpen}
                trigger={
                    <Icon
                        name={"pencil"}
                        link={true}
                        onClick={this.openModal}
                    />
                }
            >
                <Modal.Content>
                    <Grid>
                        <h1>Edit Reminder</h1>
                        <Grid.Row columns={"equal"}>
                            <Grid.Column>
                                <p>Remind me about</p>
                                <Input
                                    name="reminderText"
                                    onChange={this.handleChange}
                                    placeholder="Marketing meeting"
                                    defaultValue={reminder.reminder}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Start reminding me when</p>
                                <DatePicker
                                    minDate={moment().toDate()}
                                    selected={startDate}
                                    dateFormat="dd/MM/yyyy"
                                    timeCaption="time"
                                    onChange={this.handleStartDate}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Remind untill</p>
                                <DatePicker
                                    minDate={moment(startDate).toDate()}
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

export default UpdateReminderModal;
