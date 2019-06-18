import React from "react";

import { Grid, Dropdown } from "semantic-ui-react";

import { daysOfMonth } from "../../../../data/Planner/RepeatingTodoDropdownOptions";

class XDayOfMonth extends React.Component {
    state = {
        selectedMonthDays: this.props.selectedMonthDays
    };

    static getDerivedStateFromProps(props) {
        return {
            selectedMonthDays: props.selectedMonthDays
        };
    }

    render() {
        const { selectedMonthDays } = this.state;

        return (
            <Grid.Row>
                <p>Select Days Of Month</p>
                <Dropdown
                    placeholder="Select Days"
                    fluid
                    multiple
                    selection
                    value={selectedMonthDays}
                    options={daysOfMonth}
                    onChange={this.props.handleDaysOfMonthDropdown}
                />
            </Grid.Row>
        );
    }
}

export default XDayOfMonth;
