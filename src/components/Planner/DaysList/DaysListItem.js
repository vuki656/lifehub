// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Link } from "react-router-dom";
import { Grid, Chip } from "@material-ui/core";
import { connect } from "react-redux";

// Icon Icon
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

// Helper Imports
import { formatMoment } from "../../../helpers/Global";

// Redux Actions Imports
import { setCurrentDay } from "../../../redux/actions/plannerActions";

class DaysListItem extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        iconStatus: "",
        compleatedAmount: null,
        color: "",

        // Redux Props
        day: this.props.day
    };

    componentDidMount() {
        this.addTodoCompletedAmountListener(this.state);
        this.getCompletionStatus(this.state);
    }

    componentWillUnmount() {
        this.removeListeners(this.state);
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
            this.setState({ compleatedAmount: `${checked}/${total}` });
        } else {
            this.setState({ compleatedAmount: "0/0" });
        }
    };

    // Determine weather to put a green checkmark box or red X box
    setDayCompletionIcon = (total, checked) => {
        let greenColor = "#63ea90";
        let redColor = "#f12b2c";
        let completedStatus = "done";
        let unCompletedStatus = "undone";

        if (total) {
            if (checked === total) {
                this.setState({
                    iconStatus: completedStatus,
                    color: greenColor
                });
            } else {
                this.setState({
                    iconStatus: unCompletedStatus,
                    color: redColor
                });
            }
        } else {
            this.setState({
                iconStatus: completedStatus,
                color: greenColor
            });
        }
    };

    // Determine the icon based on the completion status
    getIcon = (iconStatus, color) => {
        let checkBox = <CheckBoxIcon style={{ fill: color }} />;
        let emptyBox = <CheckBoxOutlineBlankIcon style={{ fill: color }} />;

        switch (iconStatus) {
            case "done":
                return checkBox;
            case "undone":
                return emptyBox;
            default:
                return checkBox;
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
