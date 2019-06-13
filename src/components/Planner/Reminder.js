import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";

import { List, Icon } from "semantic-ui-react";

class Reminder extends React.Component {
    state = {
        remindersRef: firebase.database().ref("reminders"),
        currentUser: firebase.auth().currentUser,

        reminder: this.props.reminder
    };

    // Iterate trough every day reminder is active and remove reminder
    removeTodo = ({ currentUser, reminder, remindersRef }) => {
        let startDate = moment(reminder.startDate).toDate();
        let endDate = moment(reminder.endDate).toDate();

        for (
            let _startDate = moment(startDate);
            _startDate.isBefore(endDate);
            _startDate.add(1, "days")
        ) {
            // Convert start date to day only timestamp
            let dayTimestamp = moment(
                moment(_startDate).startOf("day")
            ).valueOf();

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
                    size="small"
                    verticalAlign="middle"
                />
                <List.Content>
                    <List.Header>
                        {reminder.reminder}{" "}
                        <Icon
                            name={"remove"}
                            link={true}
                            onClick={() => this.removeTodo(this.state)}
                        />
                    </List.Header>
                    <List.Description>
                        {moment(reminder.endDate).from(reminder.startDate)}
                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

export default Reminder;
