import React from "react";
import moment from "moment";
import firebase from "firebase";

import { Link } from "react-router-dom";

class DaysList extends React.Component {
    state = {
        monthObjectList: null,
        currentMonth: null,
        currentUser: firebase.auth().currentUser,
        usersRef: firebase.database().ref("users"),
        regDate: null
    };

    componentDidMount() {}

    componentWillMount() {
        this.generateDays();
    }

    // Generate day-month structure
    generateDays = () => {
        const { regDate } = this.props;
        let monthObjectList = [];

        //Generate next 12 months
        let monthList = [];
        for (let i = 0; i < 12; i++) {
            monthList.push(moment(regDate).add(i, "month"));
        }

        // Itterate trough next 12 months
        monthList.forEach((monthMomentObject, index) => {
            let daysInMonthAmount = monthMomentObject.daysInMonth();
            let year = moment(monthMomentObject).format("YYYY");
            let month = moment(monthMomentObject).format("MM");
            let monthDaysList = [];

            // Itterate trough days in month
            for (let i = 1; i < daysInMonthAmount + 1; i++) {
                monthDaysList.push(
                    moment(`${i}-${month}-${year}`, "DD/MM/YYYY")
                );
            }

            monthObjectList.push({
                month: monthList[index],
                daysList: monthDaysList
            });
            console.log(monthObjectList);

            // Empty days in month so next month can be put in
            monthDaysList = [];
        });
        this.setState({ monthObjectList: monthObjectList });
    };

    displayMonths = ({ monthObjectList }) =>
        monthObjectList.map((monthObject, index) => (
            <option key={index}>
                {moment(monthObject.month).format("MM - MMM")}
            </option>
        ));

    displayDays = ({ currentMonth }) =>
        currentMonth.daysList.map((day, index) => (
            <Link to={`/${moment(day).format("DD/MM/YYYY")}`} key={index}>
                <li>{moment(day).format("DD/MM/YYYY")}</li>
            </Link>
        ));

    render() {
        return (
            <div>
                <select>
                    {/* Display months*/}
                    {this.displayMonths(this.state)}
                </select>
                <div>
                    {/* Display days*/}
                    {this.displayDays(this.state)}
                </div>
            </div>
        );
    }
}

export default DaysList;
