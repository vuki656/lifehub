import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
import firebase from "../../../firebase/Auth";

import { Grid, Modal, Input, Button, Icon } from "semantic-ui-react";

import { getDayOnlyTimestamp } from "../../../helpers/Global";

class UpdateReminderModal extends React.Component {
    state = {
        modalOpen: false,
        reminderRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,

        newReminderText: this.props.reminder.reminder,
        oldEndDate: this.props.reminder.endDate,
        oldStartDate: this.props.reminder.startDate,
        reminder: this.props.reminder,
        newStartDate: moment(this.props.reminder.startDate).toDate(),
        newEndDate: moment(this.props.reminder.endDate).toDate()
    };

    // Send reminder object to firebase
    sendReminderToFirebase = () => {
        const {
            newStartDate,
            newEndDate,
            newReminderText,
            oldStartDate,
            oldEndDate
        } = this.state;

        let itterationStartDate = moment(newStartDate).isAfter(oldStartDate)
            ? oldStartDate
            : newStartDate;

        let itterationEndDate = moment(newEndDate).isBefore(oldEndDate)
            ? oldEndDate
            : newEndDate;

        // Save new reminder in each day from date range
        // If there are days outside new day range
        // delete them, else update them
        for (
            let itterationCurrentDate = moment(itterationStartDate);
            itterationCurrentDate.isBefore(
                moment(itterationEndDate).add(1, "day")
            );
            itterationCurrentDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(itterationCurrentDate);

            if (
                moment(itterationCurrentDate).isBetween(
                    moment(newStartDate).subtract(1, "day"),
                    moment(newEndDate).add(1, "day")
                )
            ) {
                this.updateReminder(
                    this.state,
                    newReminderText,
                    newStartDate,
                    newEndDate,
                    dayTimestamp
                );
            } else {
                this.deleteReminder(this.state, dayTimestamp);
            }
        }
        this.closeModal();
    };

    // Update reminder in firebase
    updateReminder = (
        { reminderRef, currentUser, reminder },
        newReminderText,
        newStartDate,
        newEndDate,
        dayTimestamp
    ) => {
        let formatedCurrDay = moment(dayTimestamp).format("DD/MM/YYYY");

        reminderRef
            .child(`${currentUser.uid}/${dayTimestamp}/${reminder.key}`)
            .update({
                reminder: newReminderText,
                newStartDate: newStartDate,
                endDate: newEndDate,
                key: reminder.key,
                formatedCurrDay: formatedCurrDay
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

    // Check if selected start date is before today
    // If yes, use today
    // If no, use selected day's date
    getStartingDate = () => {
        const { newStartDate } = this.state;

        if (moment(newStartDate).isBefore(moment())) {
            return moment().toDate();
        } else {
            return newStartDate;
        }
    };

    // Check if selelcted end date is before start date
    // If yes, return start date
    // If no, return end date
    getEndingDate = () => {
        const { newEndDate, newStartDate } = this.state;

        if (moment(newEndDate).isBefore(newStartDate)) {
            return newStartDate;
        } else {
            return newEndDate;
        }
    };

    resetReminderText = () => {
        this.setState({ newReminderText: this.props.reminder.reminder });
    };

    // Set the state vale of reminder
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // Save start date from calendar picker
    handleStartDate = newStartDate => {
        this.setState({ newStartDate: moment(newStartDate).valueOf() });
    };

    // Save end date from calendar picker
    handleEndDate = newEndDate => {
        this.setState({ newEndDate: moment(newEndDate).valueOf() });
    };

    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    openModal = () => {
        this.setState({ modalOpen: true });
    };

    render() {
        const { modalOpen, newStartDate, newReminderText } = this.state;

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
                                    name="newReminderText"
                                    onChange={this.handleChange}
                                    placeholder="Marketing meeting"
                                    value={newReminderText}
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
                                    minDate={moment(newStartDate).toDate()}
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
                                <Button onClick={this.resetReminderText}>
                                    Reset Reminder Text
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

export default UpdateReminderModal;
