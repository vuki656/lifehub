import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";

import { Grid } from "semantic-ui-react";
import { Route } from "react-router-dom";

import TaskArea from "./TaskArea";
import Reminders from "./Reminders";
import DaysListSidebar from "./DaysListSidebar";

class Planner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            monthObjectList: null,
            currentMonth: null,
            regDate: null,
            usersRef: firebase.database().ref("users"),
            currentUser: firebase.auth().currentUser
        };

        this.selectNewMonth = this.selectNewMonth.bind(this);
    }

    componentWillMount() {
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

    // Generate day-month structure
    // FORMAT:
    //      [monthObject1: {
    //          month: momentObject for each month
    //          daysList: [momentObject for each day]
    //      }]
    generateMonthDayStructure = regDate => {
        let monthObjectList = []; // Holds the full day & month structure
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

        let currentMonth = this.findCurrentMonthInList(monthObjectList);
        this.setState({ monthObjectList, currentMonth });
    };

    // Generate next 12 months from user reg date
    generateMonths = regDate => {
        let monthList = [];
        for (let i = 0; i < 12; i++) {
            monthList.push(moment(regDate).add(i, "month"));
        }
        return monthList;
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

    // Select new month from monthObjectList
    selectNewMonth = selectedMonth => {
        const { monthObjectList } = this.state;

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

    // Generate routes to switch the task board for selected day
    generateRoutes = currentMonth =>
        currentMonth.daysList.map(day => (
            <Route
                key={moment(day).format("DD/MM/YYYY")}
                path={`/planner/${moment(day).format("DD/MM/YYYY")}`}
                component={TaskArea}
            />
        ));

    render() {
        const { monthObjectList, currentMonth } = this.state;

        return monthObjectList && currentMonth ? (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3} className="sidebar-menu">
                            <DaysListSidebar
                                // PUT GENERATOR HERE AND SEND DATA BACK DOWN
                                monthObjectList={monthObjectList}
                                currentMonth={currentMonth}
                                selectNewMonth={this.selectNewMonth}
                            />
                        </Grid.Column>
                        <Grid.Column width={10} className="task-area">
                            {this.generateRoutes(currentMonth)}
                        </Grid.Column>
                        <Grid.Column width={3} className="sidebar-menu">
                            <Reminders />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        ) : (
            "loading"
        );
    }
}

export default Planner;
