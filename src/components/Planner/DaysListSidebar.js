import React from "react";
import moment from "moment";

import { Link } from "react-router-dom";

class DaysList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monthObjectList: this.props.monthObjectList,
            currentMonth: this.props.currentMonth
        };
    }

    // Update state when props in parent(Planner) change
    static getDerivedStateFromProps(props) {
        // Return in this lifecycle funct is same as normal setState
        return {
            monthObjectList: props.monthObjectList,
            currentMonth: props.currentMonth
        };
    }

    // Returns date formated by given moment format
    formatMoment = (objectToFormat, stringFormat) => {
        return moment(objectToFormat.month).format(stringFormat);
    };

    // Display month lists in sidebar dropdown
    displayMonths = monthObjectList =>
        monthObjectList.map((monthObject, index) => (
            <option key={index} value={this.formatMoment(monthObject, "M/YY")}>
                {this.formatMoment(monthObject, "MM/YY - MMM")}
            </option>
        ));

    // Display list of days in the sidebar
    displayDays = currentMonth =>
        currentMonth.daysList.map((day, index) => (
            <Link
                to={`/planner/${moment(day).format("DD/MM/YYYY")}`}
                key={index}
            >
                <li>{moment(day).format("DD/MM/YYYY")}</li>
            </Link>
        ));

    handleDropdownChange = event => {
        let selectedMonth = event.target.value;
        this.props.selectNewMonth(selectedMonth);
    };

    render() {
        const { monthObjectList, currentMonth } = this.state;

        return monthObjectList ? (
            <div>
                <select
                    defaultValue={moment(currentMonth.month).format("M/YY")}
                    onChange={this.handleDropdownChange}
                >
                    {this.displayMonths(monthObjectList)}
                </select>
                <div>{this.displayDays(currentMonth)}</div>
            </div>
        ) : (
            "loading"
        );
    }
}

export default DaysList;
