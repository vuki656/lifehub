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
            // Convert start date to day only timestamp
            let dayTimestamp = moment(
                moment(itterationCurrentDate).startOf("day")
            ).valueOf();

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
        console.log("deleting");
        reminderRef
            .child(`${currentUser.uid}/${dayTimestamp}/${reminder.key}`)
            .remove()
            .catch(err => {
                console.error(err);
            });
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
        const { reminder, modalOpen, newStartDate, newEndDate } = this.state;

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
                                    defaultValue={reminder.reminder}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Start reminding me when</p>
                                <DatePicker
                                    minDate={moment().toDate()}
                                    selected={newStartDate}
                                    dateFormat="dd/MM/yyyy"
                                    timeCaption="time"
                                    onChange={this.handleStartDate}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <p>Remind untill</p>
                                <DatePicker
                                    minDate={moment(newStartDate).toDate()}
                                    selected={newEndDate}
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
