// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { List, Icon } from "semantic-ui-react";

// Component Imports
import ReminderModal from "./ReminderModal";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class Reminder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            remindersRef: firebase.database().ref("reminders"),
            currentUser: firebase.auth().currentUser,
            modalOpen: false,

            currentDay: this.props.currentDay,
            reminder: this.props.reminder
        };

        this.closeModal = this.closeModal.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            reminder: props.reminder,
            currentDay: props.currentDay
        };
    }

    // Iterate trough days where reminder stored and remove it from each
    removeReminder = ({ currentUser, reminder, remindersRef }) => {
        let startDate = moment(reminder.startDate).toDate();
        let endDate = moment(reminder.endDate).toDate();

        for (
            let _startDate = moment(startDate);
            _startDate.isBefore(moment(endDate).add(1, "day"));
            _startDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(_startDate);

            remindersRef
                .child(`${currentUser.uid}/${dayTimestamp}/${reminder.key}`)
                .remove()
                .catch(error => console.error(error));
        }
    };

    closeModal = () => {
        this.setState({ modalOpen: false });
    };

    openModal = () => {
        this.setState({ modalOpen: true });
    };

    render() {
        const { reminder, modalOpen, currentDay } = this.state;

        return (
            <List.Item>
                <List.Icon
                    name="calendar outline"
                    size="large"
                    verticalAlign="middle"
                />
                <List.Content>
                    <List.Header>
                        {reminder.text}
                        <Icon
                            name={"remove"}
                            link={true}
                            onClick={() => this.removeReminder(this.state)}
                        />
                        <Icon
                            name={"pencil"}
                            link={true}
                            onClick={this.openModal}
                        />
                        <ReminderModal
                            reminder={reminder}
                            modalOpen={modalOpen}
                            closeModal={this.closeModal}
                            currentDay={currentDay}
                        />
                    </List.Header>
                </List.Content>
            </List.Item>
        );
    }
}

export default Reminder;
