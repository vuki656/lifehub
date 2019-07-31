// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";

// Destructured Imports
import { Grid } from "semantic-ui-react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

// Component Imports
import TaskArea from "./TaskArea";
import DaysList from "./DaysList/DaysList";

// Helper Imports
import { formatMoment } from "../../helpers/Global";

// Redux Actions Imports
import { fetchUserSettings } from "../../redux/actions/plannerActions";

class Planner extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            usersRef: firebase.database().ref("users"),
            currentUser: firebase.auth().currentUser,
            monthObjectList: null,
            currentMonth: null,

            // Redux Props
            currentDay: this.props.currentDay,
            regDate: this.props.regDate
        };

        this.selectNewMonth = this.selectNewMonth.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay,
            regDate: props.regDate
        };
    }

    componentDidMount() {
        this.props.fetchUserSettings(this.state);
        this.generateMonthDayStructure(this.state.regDate, this.state);
    }

    componentDidUpdate(prevProps) {
        if (this.props.regDate !== prevProps.regDate) {
            this.generateMonthDayStructure(this.state.regDate, this.state);
        }
    }

    // Generate day-month structure
    // FORMAT:
    //      [monthObject1: {
    //          month: momentObject for each month
    //          daysList: [momentObject for each day]
    //      }]
    generateMonthDayStructure = (regDate, { currentDay }) => {
        let monthObjectList = []; // Holds the full day & month structure
        let monthList = this.generateMonths(regDate);

        // Iterate trough next 12 months
        monthList.forEach((momentMonthObject, index) => {
            let daysInMonthAmount = momentMonthObject.daysInMonth();
            let year = moment(momentMonthObject).format("YYYY");
            let month = moment(momentMonthObject).format("MM");
            let daysOfMonthList = [];

            let countStart = this.getStartingIndex(momentMonthObject, regDate);

            // Iterate trough days in month
            for (let i = countStart; i < daysInMonthAmount + 1; i++) {
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

        // Redirect user to current days planner page after getting data
        this.setState({ monthObjectList, currentMonth }, () => {
            this.props.history.push(
                `/planner/${moment(currentDay).format("DD/MM/YYYY")}`
            );
        });
    };

    // Generate next 12 months from user reg date
    generateMonths = regDate => {
        let monthList = [];

        let noOfMonthsToGenerate = this.getMonthsToGenerateNo(regDate);
        this.saveDateUntillMonthsGenerated(this.state, noOfMonthsToGenerate);

        for (let i = 0; i < noOfMonthsToGenerate; i++) {
            monthList.push(moment(regDate).add(i, "month"));
        }
        return monthList;
    };

    // Checks if current month is month user registered,
    // If yes, return register day so counter can count
    // from it to end of the month
    // Else, return 1 so it starts from beggining of month
    getStartingIndex = (momentMonthObject, regDate) => {
        if (
            moment(momentMonthObject).format("MM/YY") ===
            moment(regDate).format("MM/YY")
        ) {
            return moment(regDate).format("DD");
        } else {
            return 1;
        }
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

    // Save the date untill months are generated
    saveDateUntillMonthsGenerated = (
        { usersRef, currentUser },
        monthsToGenerate
    ) => {
        let generateMonthsUntillDate = moment()
            .add(monthsToGenerate, "months")
            .endOf("month")
            .startOf("day")
            .valueOf();

        usersRef
            .child(currentUser.uid)
            .update({ generateUntill: generateMonthsUntillDate });
    };

    // After each month passes, add one aditional month to
    // be generated in month list so that you always have
    // one year from now available in the planner days list
    getMonthsToGenerateNo = regDate => {
        return 13 + moment(moment()).diff(regDate, "months");
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

    // Generate routes to switch the task area for selected day
    generateRoutes = currentMonth =>
        currentMonth.daysList.map(day => (
            <Route
                key={moment(day).format("DD/MM/YYYY")}
                path={`/planner/${moment(day).format("DD/MM/YYYY")}`}
                render={() => <TaskArea />}
            />
        ));

    render() {
        const { monthObjectList, currentMonth, currentDay } = this.state;

        return currentMonth ? (
            <Grid>
                <Grid.Row>
                    <Grid.Column
                        width={3}
                        className="sidebar-menu pad-lef-rig-0"
                    >
                        <DaysList
                            monthObjectList={monthObjectList}
                            currentMonth={currentMonth}
                            selectNewMonth={this.selectNewMonth}
                        />
                    </Grid.Column>
                    <Grid.Column width={13}>
                        {this.generateRoutes(currentMonth, currentDay)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        ) : (
            "loading"
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    regDate: state.planner.regDate
});

export default connect(
    mapStateToProps,
    { fetchUserSettings }
)(Planner);
