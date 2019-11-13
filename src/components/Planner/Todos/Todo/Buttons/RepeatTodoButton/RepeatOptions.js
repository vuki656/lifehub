// Object Imports
import React from "react";

// Destructured Imports
import { Grid, Dropdown, Checkbox } from "semantic-ui-react";

// Data Imports
import {
    daysOfMonth,
    daysOfWeek
} from "../../../../../../data/Planner/RepeatingTodoDropdownOptions";

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

        let weekDays = selectedWeekDays ? selectedWeekDays : [];
        let monthDays = selectedMonthDays ? selectedMonthDays : [];

        return (
            <React.Fragment>
                <Grid.Row>
                    <p className="repeat-todo-subtitle">Select Week Days</p>
                    <Dropdown
                        className="repeat-todo-dropdown"
                        placeholder="Select Days"
                        name="selectedWeekDays"
                        fluid
                        multiple
                        selection
                        value={weekDays}
                        options={daysOfWeek}
                        onChange={this.props.handleDaysOfWeekDropdown}
                    />
                </Grid.Row>
                <Grid.Row>
                    <p className="repeat-todo-subtitle">Select Days Of Month</p>
                    <Dropdown
                        className="repeat-todo-dropdown"
                        placeholder="Select Days"
                        name="selectedMonthDays"
                        fluid
                        multiple
                        selection
                        value={monthDays}
                        options={daysOfMonth}
                        onChange={this.props.handleDaysOfMonthDropdown}
                    />
                </Grid.Row>
                <Grid.Row>
                    <Checkbox
                        className="mar-bot-0-5-rem"
                        label={"Repeat at the start of month"}
                        name="repeatAtStartOfMonth"
                        checked={repeatAtStartOfMonth}
                        onChange={this.props.handleCheckboxChange}
                    />
                    <br />
                    <Checkbox
                        className="mar-bot-0-5-rem"
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
