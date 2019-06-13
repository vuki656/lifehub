import React from "react";
import moment from "moment";

import { List } from "semantic-ui-react";

class Reminder extends React.Component {
    state = {
        reminder: this.props.reminder
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
                    <List.Header>{reminder.reminder}</List.Header>
                    <List.Description>
                        {moment(reminder.endDate).from(reminder.startDate)}
                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

export default Reminder;
