// Other Imports
import React from "react";
import firebase from "../../../firebase/Auth";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
// Component Imports
import { DaysListItemCount } from "./DaysListItemCount";
import { DaysListItemCheckbox } from "./DaysListItemCheckbox";
import { DaysListItemText } from "./DaysListItemText";
// Helper Imports
import { formatMoment } from "../../../helpers/Global";

// Redux Actions Imports

class DaysListItem extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),

        // Base
        completedAmount: 0,
        totalAmount: 0,

        // Props
        day: this.props.day
    };

    componentDidMount() {
        this._isMounted = true;

        this.addTodoCompletedAmountListener(this.state);
        this.getCompletionStatus(this.state);
    }

    componentWillUnmount() {
        this.removeListeners(this.state);
        this._isMounted = false;
    }

    // Listen for completed todo amount change
    addTodoCompletedAmountListener = ({ todoRef, currentUser }) => {
        todoRef.child(`${currentUser.uid}/`).on("child_changed", () => {
            this.getCompletionStatus(this.state);
        });
    };

    // Deactivate database listeners
    removeListeners = ({ todoRef, currentUser }) => {
        todoRef.child(`${currentUser.uid}`).off();
    };

    // Get todo completion amount
    getCompletionStatus = ({ todoRef, currentUser, day }) => {
        let totalAmount = 0;
        let completedAmount = 0;

        todoRef
            .child(`${currentUser.uid}/${day.valueOf()}/count/`)
            .on("value", countCategories => {
                if (countCategories.exists()) {
                    countCategories.forEach(countCategory => {
                        totalAmount = totalAmount + countCategory.val().total;
                        completedAmount = completedAmount + countCategory.val().checked;
                    });
                }
            });

        this.setState({ totalAmount, completedAmount });
    };


    render() {
        const { day, completedAmount, totalAmount } = this.state;

        return (
            <Link
                to={`/planner/${formatMoment(day, "DD/MM/YYYY")}`}
                key={formatMoment(day, "DD/MM/YYYY")}
                onClick={() => this.props.setCurrentDay(day)}
                className="planner__sidebar__dayslist__item__link"
            >
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="stretch"
                    className="planner__sidebar__dayslist__item"
                >
                    <Grid xs={2} item className="content--center--vertical">
                        <DaysListItemCount totalAmount={totalAmount} completedAmount={completedAmount} />
                    </Grid>
                    <Grid xs={9} item className="content--center--vertical">
                        <DaysListItemText day={day} />
                    </Grid>
                    <Grid xs={1} item className="content--center--vertical">
                        <DaysListItemCheckbox totalAmount={totalAmount} completedAmount={completedAmount} />
                    </Grid>
                </Grid>
            </Link>
        );
    }
}

export default connect(null, { setCurrentDay })(DaysListItem);
