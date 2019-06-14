import React from "react";

import { formatMoment } from "../../helpers/Global";

import { Link } from "react-router-dom";

class DaysList extends React.Component {
    state = {
        monthObjectList: this.props.monthObjectList,
        currentMonth: this.props.currentMonth
    };

    // Get parent props -> causes re-render
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
        currentMonth.daysList.map(day => (
            <Link
                to={`/planner/${formatMoment(day, "DD/MM/YYYY")}`}
                key={formatMoment(day, "DD/MM/YYYY")}
                onClick={() => this.props.setCurrentDay(day)}
            >
                <li>{formatMoment(day, "DD/MM/YYYY")}</li>
            </Link>
        ));

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
                >
                    {this.displayMonths(monthObjectList)}
                </select>
                {this.displayDays(currentMonth)}
            </React.Fragment>
        );
    }
}

export default DaysList;
