import React from "react";
import moment from "moment";
import firebase from "../../../firebase/Auth";

import { List, Icon } from "semantic-ui-react";

import { getDayOnlyTimestamp } from "../../../helpers/Global";

import UpdateReminderModal from "./UpdateReminderModal";

class Reminder extends React.Component {
    state = {
        remindersRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,
        modalOpen: false,

        reminder: this.props.reminder
    };

    // Get parent props -> causes re-render
    static getDerivedStateFromProps(props) {
        return {
            reminder: props.reminder
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

    render() {
        const { reminder } = this.state;

        return (
            <List.Item>
                <List.Icon
                    name="calendar outline"
                    size="large"
                    verticalAlign="middle"
                />
                <List.Content>
                    <List.Header>
                        {reminder.reminder}
                        <Icon
                            name={"remove"}
                            link={true}
                            onClick={() => this.removeReminder(this.state)}
                        />

                        <UpdateReminderModal reminder={reminder} />
                    </List.Header>
                    <List.Description>
                        <p>Desc</p>
                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

export default Reminder;
