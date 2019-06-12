import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";

import { Grid, Modal, Input, Button } from "semantic-ui-react";

class ReminderModal extends React.Component {
    state = {
        currentDay: moment(this.props.currentDay).toDate(),
        minDate: moment().toDate(),
        startDate: null,
        modalOpen: false
    };

    fetchReminder = () => {
        // Get all reminders whose due date is today or the future
        // Or just put the reminder in each day until due date and render that day on click
    };

    handleStartDate = date => {
        console.log("Start date: " + moment(date).format("DD/MM/YYYY HH:mm"));
        this.setState({ minDate: date });
    };

    handleEndDate = date => {
        console.log("End date: " + moment(date).format("DD/MM/YYYY HH:mm"));
    };

    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    openModal = () => {
        this.setState({ modalOpen: true });
    };

    render() {
        const { currentDay, minDate, modalOpen } = this.state;

        return (
            <React.Fragment>
                <Modal open={modalOpen}>
                    <Modal.Content>
                        <Grid>
                            <Grid.Row columns={"equal"}>
                                <Grid.Column>
                                    <p>Remind me about</p>
                                    <Input placeholder="Marketing meeting" />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Start reminding me when</p>
                                    <DatePicker
                                        minDate={currentDay}
                                        selected={currentDay}
                                        onChange={this.handleStartDate}
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <p>Remind untill</p>
                                    <DatePicker
                                        minDate={minDate}
                                        selected={currentDay}
                                        onChange={this.handleEndDate}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        timeCaption="time"
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Button.Group>
                                    <Button primary>Save</Button>
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
