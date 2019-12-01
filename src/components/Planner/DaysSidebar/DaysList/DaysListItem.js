// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";

// Destructured Imports
import { Link } from "react-router-dom";
import { Grid, Chip } from "@material-ui/core";
import { connect } from "react-redux";

// Icon Imports
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";

// Helper Imports
import { formatMoment } from "../../../../helpers/Global";

// Redux Actions Imports
import { setCurrentDay } from "../../../../redux/actions/plannerActions";

class DaysListItem extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),

        // Base
        iconStatus: "",
        compleatedAmount: null,
        color: "",

        // Redux Props
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

    // Set how many todos are completed
    // Determine if day is completed or not
    getCompletionStatus = ({ todoRef, currentUser, day }) => {
        let total = 0;
        let checked = 0;

        todoRef
            .child(`${currentUser.uid}/${day.valueOf()}/count/`)
            .on("value", countCategories => {
                if (countCategories.exists()) {
                    countCategories.forEach(countCategory => {
                        total = total + countCategory.val().total;
                        checked = checked + countCategory.val().checked;
                    });
                }
            });

        this.setDayCompletionIcon(total, checked);
        this.setDayCompletionAmount(total, checked);
    };

    // Set how many todos are completed in the day
    setDayCompletionAmount = (total, checked) => {
        if (total) {
            this._isMounted &&
                this.setState({ compleatedAmount: `${checked}/${total}` });
        } else {
            this._isMounted && this.setState({ compleatedAmount: "0/0" });
        }
    };

    // Determine weather to put a green checkmark box or red empty box
    setDayCompletionIcon = (total, checked) => {
        let greenColor = "#63ea90";
        let redColor = "#f12b2c";
        let completedStatus = "done";
        let unCompletedStatus = "undone";

        if (total) {
            if (checked === total) {
                this._isMounted &&
                    this.setState({
                        iconStatus: completedStatus,
                        color: greenColor
                    });
            } else {
                this._isMounted &&
                    this.setState({
                        iconStatus: unCompletedStatus,
                        color: redColor
                    });
            }
        } else {
            this._isMounted &&
                this.setState({
                    iconStatus: completedStatus,
                    color: greenColor
                });
        }
    };

    // Determine and return the icon based on the completion status
    getIcon = (iconStatus, color) => {
        let doneBox = <CheckBoxIcon style={{ fill: color }} />;
        let notDoneBox = <IndeterminateCheckBoxIcon style={{ fill: color }} />;

        switch (iconStatus) {
            case "done":
                return doneBox;
            case "undone":
                return notDoneBox;
            default:
                return doneBox;
        }
    };

    render() {
        const { color, day, iconStatus, compleatedAmount } = this.state;

        return (
            <Link
                to={`/planner/${formatMoment(day, "DD/MM/YYYY")}`}
                key={formatMoment(day, "DD/MM/YYYY")}
                onClick={() => this.props.setCurrentDay(day)}
            >
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="stretch"
                >
                    <Grid xs={9} item>
                        {formatMoment(day, "DD/MM/YYYY - ddd")}
                    </Grid>
                    <Grid xs={2} item>
                        <Chip label={compleatedAmount} />
                    </Grid>
                    <Grid xs={1} item>
                        {this.getIcon(iconStatus, color)}
                    </Grid>
                </Grid>
            </Link>
        );
    }
}

export default connect(null, { setCurrentDay })(DaysListItem);
