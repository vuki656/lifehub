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
            let regDate = snapshot.val().regDate;
            this.generateDays(regDate);
        });
    };

    // Generate day-month structure
    generateDays = regDate => {
        let monthObjectList = [];
        let currentMonth = null;

        //Generate next 12 months
        let monthList = [];
        for (let i = 0; i < 12; i++) {
            monthList.push(moment(regDate).add(i, "month"));
        }

        // Iterate trough next 12 months
        monthList.forEach((momentMonthObject, index) => {
            let daysInMonthAmount = momentMonthObject.daysInMonth();
            let year = moment(momentMonthObject).format("YYYY");
            let month = moment(momentMonthObject).format("MM");
            let isCurrentMonth = false;
            let monthDaysList = [];

            // Iterate trough days in month
            for (let i = 1; i < daysInMonthAmount + 1; i++) {
                monthDaysList.push(
                    moment(`${i}-${month}-${year}`, "DD/MM/YYYY")
                );
            }

            if (
                moment().format("MM/YYYY") ===
                moment(momentMonthObject).format("MM/YYYY")
            ) {
                currentMonth = momentMonthObject;
                isCurrentMonth = true;
            }

            monthObjectList.push({
                month: monthList[index],
                daysList: monthDaysList,
                isCurrentMonth: isCurrentMonth
            });

            // Empty days in month so next month can be put in
            monthDaysList = [];
        });

        console.log(monthObjectList);

        monthObjectList.forEach(monthObject => {
            if (monthObject.isCurrentMonth) {
                currentMonth = monthObject;
            }
        });

        this.setState({ monthObjectList, currentMonth });
        // this.findCurrMonthInList(this.state);
    };

    displayMonths = monthObjectList =>
        monthObjectList.map((monthObject, index) => (
            <option
                key={index}
                value={moment(monthObject.month).format("M/YY")}
            >
                {moment(monthObject.month).format("MM/YY - MMM")}
            </option>
        ));

    // FORMAT SHOULD BE CORRECT BUT IT DOESN'T RETURN ANYTHING
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
                <select value={moment(currentMonth.month).format("M/YY")}>
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
