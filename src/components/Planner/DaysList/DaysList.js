// Object Imports
import React from "react";

// Helper Imports
import { Grid } from "semantic-ui-react";

// Component Imports
import DaysListItem from "./DaysListItem";

// Helper Imports
import { formatMoment } from "../../../helpers/Global";

class DaysList extends React.Component {
    state = {
        monthObjectList: this.props.monthObjectList,
        currentMonth: this.props.currentMonth
    };

    static getDerivedStateFromProps(props) {
        return {
            monthObjectList: props.monthObjectList,
            currentMonth: props.currentMonth
        };
    }

    // Display month lists in sidebar dropdown
    displayMonths = monthObjectList =>
        monthObjectList.map((monthObject, index) => (
            <option key={index} value={formatMoment(monthObject.month, "M/YY")}>
                {formatMoment(monthObject.month, "MM/YY - MMM")}
            </option>
        ));

    // Display list of days in the sidebar
    displayDays = currentMonth =>
        currentMonth.daysList.map(day => <DaysListItem key={day} day={day} />);

    // Dropdown value is accepted here and sent
    // back to parent(Planner.js) via selectNewMonth funct
    handleDropdownChange = event => {
        let selectedMonth = event.target.value;
        this.props.selectNewMonth(selectedMonth);
    };

    render() {
        const { monthObjectList, currentMonth } = this.state;

        return (
            <React.Fragment>
                <select
                    defaultValue={formatMoment(currentMonth.month, "M/YY")}
                    onChange={this.handleDropdownChange}
                    className="month-dropdown"
                >
                    {this.displayMonths(monthObjectList)}
                </select>
                <Grid className="days-list">
                    {this.displayDays(currentMonth)}
                </Grid>
            </React.Fragment>
        );
    }
}

export default DaysList;
