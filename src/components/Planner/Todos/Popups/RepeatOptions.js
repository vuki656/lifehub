import React from "react";

import { Grid, Dropdown } from "semantic-ui-react";

import {
    daysOfMonth,
    daysOfWeek
} from "../../../../data/Planner/RepeatingTodoDropdownOptions";

class RepeatOptions extends React.Component {
    state = {
        selectedWeekDays: this.props.selectedWeekDays,
        selectedMonthDays: this.props.selectedMonthDays
    };

    static getDerivedStateFromProps(props) {
        return {
            selectedWeekDays: props.selectedWeekDays,
            selectedMonthDays: props.selectedMonthDays
        };
    }

    render() {
        const { selectedWeekDays, selectedMonthDays } = this.state;

        return (
            <React.Fragment>
                <Grid.Row>
                    <p>Select Week Days</p>
                    <Dropdown
                        placeholder="Select Days"
                        fluid
                        multiple
                        selection
                        value={selectedWeekDays}
                        options={daysOfWeek}
                        onChange={this.props.handleDaysOfWeekDropdown}
                    />
                </Grid.Row>
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
            </React.Fragment>
        );
    }
}

export default RepeatOptions;
