// Object Imports
import React from "react";

// Destructured Imports
import { Grid, Dropdown } from "semantic-ui-react";

// Data Imports
import { daysOfWeek } from "../../../../data/Planner/RepeatingTodoDropdownOptions";

class XDayOfWeek extends React.Component {
    state = {
        selectedWeekDays: this.props.selectedWeekDays
    };

    static getDerivedStateFromProps(props) {
        return {
            selectedWeekDays: props.selectedWeekDays
        };
    }

    render() {
        const { selectedWeekDays } = this.state;

        return (
            <Grid.Row>
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
        );
    }
}

export default XDayOfWeek;
