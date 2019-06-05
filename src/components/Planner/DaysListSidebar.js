import React from "react";
import moment from "moment";
import firebase from "firebase";

import { Link } from "react-router-dom";

class DaysList extends React.Component {
    state = {
        monthObjectList: null,
        currentMonth: moment().format("M/YY"),
        currentUser: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        regDate: null
    };

    componentDidMount() {
        this.fetchRegDate();
    }

    // Fetches weight data from firebase
    fetchRegDate = () => {
        const { currentUser, usersRef } = this.state;

        usersRef.child(currentUser.uid).once("value", snapshot => {
            let regDate = snapshot.val().regDate; // Moment timestamp of time when user registered
            this.generateMonthDayStructure(regDate);
        });
    };

    // Select new month from monthObjectList
    selectNewMonth = event => {
        const { monthObjectList } = this.state;
        let selectedMonth = event.target.value;

        // Find the selected month object in monthObjectList
        monthObjectList.forEach(monthObject => {
            if (selectedMonth === this.formatMoment(monthObject, "M/YY")) {
                this.setState({ currentMonth: monthObject });
            }
        });
    };

    // Returns date formated by given moment format
    formatMoment = (objectToFormat, stringFormat) => {
        return moment(objectToFormat.month).format(stringFormat);
    };

    // Gets the current month in monthObjectList
    findCurrentMonthInList = monthObjectList => {
        let currentMonth = moment().format("M/YY");
        let foundMonth = null;

        monthObjectList.forEach(monthObject => {
            if (currentMonth === this.formatMoment(monthObject, "M/YY")) {
                foundMonth = monthObject;
            }
        });

        return foundMonth;
    };

    // Generate next 12 months from user reg date
    generateMonths = regDate => {
        let monthList = [];
        for (let i = 0; i < 12; i++) {
            monthList.push(moment(regDate).add(i, "month"));
        }
        return monthList;
    };

    // Display month lists in sidebar dropdown
    displayMonths = monthObjectList =>
        monthObjectList.map((monthObject, index) => (
            <option key={index} value={this.formatMoment(monthObject, "M/YY")}>
                {this.formatMoment(monthObject, "MM/YY - MMM")}
            </option>
        ));

    // Generate day-month structure
    // FORMAT:
    //      [monthObject1: {
    //          month: momentObject for each month
    //          daysList: [momentObject for each day]
    //      }]
    generateMonthDayStructure = regDate => {
        let monthObjectList = []; // Holds the full day & month structure
        let currentMonth = null;
        let monthList = this.generateMonths(regDate);

        // Iterate trough next 12 months
        monthList.forEach((momentMonthObject, index) => {
            let daysInMonthAmount = momentMonthObject.daysInMonth();
            let year = moment(momentMonthObject).format("YYYY");
            let month = moment(momentMonthObject).format("MM");
            let daysOfMonthList = [];

            // Iterate trough days in month
            for (let i = 1; i < daysInMonthAmount + 1; i++) {
                daysOfMonthList.push(
                    moment(`${i}-${month}-${year}`, "DD/MM/YYYY")
                );
            }

            monthObjectList.push({
                month: monthList[index],
                daysList: daysOfMonthList
            });

            // Empty days in month so next month can be put in
            daysOfMonthList = [];
        });

        currentMonth = this.findCurrentMonthInList(monthObjectList);
        this.setState({ monthObjectList, currentMonth });
    };

    // Display list of days in the sidebar
    displayDays = currentMonth =>
        currentMonth.daysList.map((day, index) => (
            <Link to={`/${moment(day).format("DD/MM/YYYY")}`} key={index}>
                <li>{moment(day).format("DD/MM/YYYY")}</li>
            </Link>
        ));

    render() {
        const { monthObjectList, currentMonth } = this.state;

        return monthObjectList ? (
            <div>
                <select
                    defaultValue={moment(currentMonth.month).format("M/YY")}
                    onChange={this.selectNewMonth}
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
