import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";

import { formatMoment } from "../../helpers/Planner";

import { Grid } from "semantic-ui-react";
import { Route } from "react-router-dom";

import TaskArea from "./TaskArea";
import DaysList from "./DaysList";

class Planner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            monthObjectList: null,
            currentMonth: null,
            currentDay: null,
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
            if (currentMonth === formatMoment(monthObject.month, "M/YY")) {
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
            if (selectedMonth === formatMoment(monthObject.month, "M/YY")) {
                this.setState({ currentMonth: monthObject });
            }
        });
    };

    setCurrentDay = day => {
        this.setState({ currentDay: day.valueOf() });
    };

    // Generate routes to switch the task board for selected day
    generateRoutes = (currentMonth, monthObjectList, currentDay) =>
        currentMonth.daysList.map(day => (
            <Route
                key={moment(day).format("DD/MM/YYYY")}
                path={`/planner/${moment(day).format("DD/MM/YYYY")}`}
                render={() => (
                    <TaskArea
                        monthObjectList={monthObjectList}
                        currentDay={currentDay}
                    />
                )} // Same as component, this is used when you need to pass props
            />
        ));

    render() {
        const { monthObjectList, currentMonth, currentDay } = this.state;

        return monthObjectList && currentMonth ? (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3} className="sidebar-menu">
                        <DaysList
                            monthObjectList={monthObjectList}
                            currentMonth={currentMonth}
                            selectNewMonth={this.selectNewMonth}
                            setCurrentDay={this.setCurrentDay}
                        />
                    </Grid.Column>
                    <Grid.Column width={13} className="task-area">
                        {this.generateRoutes(
                            currentMonth,
                            monthObjectList,
                            currentDay
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        ) : (
            "loading"
        );
    }
}

export default Planner;
