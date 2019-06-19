import React from "react";

import { Grid, Dropdown, Checkbox } from "semantic-ui-react";

import {
    daysOfMonth,
    daysOfWeek
} from "../../../../data/Planner/RepeatingTodoDropdownOptions";

class RepeatOptions extends React.Component {
    state = {
        selectedWeekDays: this.props.selectedWeekDays,
        selectedMonthDays: this.props.selectedMonthDays,
        repeatAtEndOfMonth: this.props.repeatAtEndOfMonth,
        repeatAtStartOfMonth: this.props.repeatAtStartOfMonth
    };

    static getDerivedStateFromProps(props) {
        return {
            selectedWeekDays: props.selectedWeekDays,
            selectedMonthDays: props.selectedMonthDays,
            repeatAtStartOfMonth: props.repeatAtStartOfMonth,
            repeatAtEndOfMonth: props.repeatAtEndOfMonth
        };
    }

    render() {
        const {
            selectedWeekDays,
            selectedMonthDays,
            repeatAtStartOfMonth,
            repeatAtEndOfMonth
        } = this.state;

        return (
            <React.Fragment>
                <Grid.Row>
                    <p>Select Week Days</p>
                    <Dropdown
                        placeholder="Select Days"
                        name="selectedWeekDays"
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
                        name="selectedMonthDays"
                        fluid
                        multiple
                        selection
                        value={selectedMonthDays}
                        options={daysOfMonth}
                        onChange={this.props.handleDaysOfMonthDropdown}
                    />
                </Grid.Row>
                <Grid.Row>
                    <Checkbox
                        label={"Repeat at the start of month"}
                        name="repeatAtStartOfMonth"
                        checked={repeatAtStartOfMonth}
                        onChange={this.props.handleCheckboxChange}
                    />
                    <Checkbox
                        label={"Repeat at the end of month"}
                        name="repeatAtEndOfMonth"
                        checked={repeatAtEndOfMonth}
                        onChange={this.props.handleCheckboxChange}
                    />
                </Grid.Row>
            </React.Fragment>
        );
    }
}

export default RepeatOptions;
