// Other Imports
import React from "react";
import moment from "moment";
import firebase from "../../firebase/Auth";
import { connect } from "react-redux";
// Component Imports
import { PlannerSidebar } from "./PlannerSidebar";
import { PlannerMainRoutes } from "./PlannerMainRoutes";
import { Transition } from "../Misc/Transition";
// Helper Imports
import { formatMoment } from "../../helpers/Global";
// Redux Actions Imports
import { fetchUserSettings } from "../../redux/actions/plannerActions";

class Planner extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            // Firebase
            currentUser: firebase.auth().currentUser,
            usersRef: firebase.database().ref("users"),

            // Base
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
        this._isMounted = true;
        this.props.fetchUserSettings(this.state);
        this.generateMonthDayStructure(this.state.regDate, this.state);
    }

    componentDidUpdate(prevProps) {
        if (this.props.regDate !== prevProps.regDate) {
            this.generateMonthDayStructure(this.state.regDate, this.state);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
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
        this._isMounted &&
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
        this.saveDateUntilMonthsGenerated(this.state, noOfMonthsToGenerate);

        for (let i = 0; i < noOfMonthsToGenerate; i++) {
            monthList.push(moment(regDate).add(i, "month"));
        }
        return monthList;
    };

    // Checks if current month is month user registered,
    // If yes, return register day so counter can count
    // from it to end of the month
    // Else, return 1 so it starts from beginning of month
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

    // Save the date until months are generated
    saveDateUntilMonthsGenerated = (
        { usersRef, currentUser },
        monthsToGenerate
    ) => {
        let generateMonthsUntilDate = moment()
            .add(monthsToGenerate, "months")
            .endOf("month")
            .startOf("day")
            .valueOf();

        usersRef
            .child(currentUser.uid)
            .update({ generateUntill: generateMonthsUntilDate });
    };

    // After each month passes, add one additional month to
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
                this._isMounted && this.setState({ currentMonth: monthObject });
            }
        });
    };


    render() {
        const { monthObjectList, currentMonth } = this.state;

        return currentMonth ? (
            <div className="planner">
                <PlannerSidebar
                    monthObjectList={monthObjectList}
                    currentMonth={currentMonth}
                    selectNewMonth={this.selectNewMonth}
                />
                <PlannerMainRoutes currentMonth={currentMonth} />
            </div>
        ) : (
            <Transition />
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    regDate: state.planner.regDate
});

export default connect(mapStateToProps, { fetchUserSettings })(Planner);
