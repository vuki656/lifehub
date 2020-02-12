// Object Imports
import React from "react";

import { MenuItem, Select } from "@material-ui/core";
// Helper Imports
import { formatMoment } from "../../helpers/Global";

class PlannerMonthDropdown extends React.Component {
    // Dropdown value is accepted here and sent
    // back to parent(Planner.js) via selectNewMonth function
    handleDropdownChange = event => {
        // Get month value from button
        let selectedMonth = event.target.value;
        this.props.selectNewMonth(selectedMonth);
    };

    // Display month lists in sidebar dropdown
    displayMonths = monthObjectList =>
        monthObjectList.map((monthObject, index) => (
            <MenuItem
                key={index}
                value={formatMoment(monthObject.month, "M/YY")}
            >
                {formatMoment(monthObject.month, "MM/YY - MMM")}
            </MenuItem>
        ));

    render() {
        const { currentMonth, monthObjectList } = this.props;

        return (
            <Select
                value={formatMoment(currentMonth.month, "M/YY")}
                onChange={this.handleDropdownChange}
                className="planner__sidebar__monthdropdown"
            >
                {this.displayMonths(monthObjectList)}
            </Select>
        );
    }
}

export default PlannerMonthDropdown;
