// Other Imports
import React from "react";
// Helper Imports
import { formatMoment } from "../../../helpers/functions/Global";

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
            <option
                key={index}
                value={formatMoment(monthObject.month, "M/YY")}
                className="planner__sidebar__monthdropdown__item"
            >
                {formatMoment(monthObject.month, "MM/YY - MMM")}
            </option>
        ));

    render() {
        const { currentMonth, monthObjectList } = this.props;

        return (
            <select
                value={formatMoment(currentMonth.month, "M/YY")}
                onChange={this.handleDropdownChange}
                className="planner__sidebar__monthdropdown"
            >
                {this.displayMonths(monthObjectList)}
            </select>
        );
    }
}

export default PlannerMonthDropdown;
