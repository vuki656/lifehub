// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Link } from "react-router-dom";
import { Icon, Grid } from "semantic-ui-react";
import { connect } from "react-redux";

// Helper Imports
import { formatMoment, getDayOnlyTimestamp } from "../../../helpers/Global";

// Redux Actions Imports
import { setCurrentDay } from "../../../redux/actions/plannerActions";

class DaysListItem extends React.Component {
    state = {
        iconStatus: "",
        compleatedAmount: null,
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        // Redux Props
        day: this.props.day
    };

    componentDidMount() {
        this.addTodoCompleatedAmountListener(this.state);
        this.getCompletionStatus(this.state);
    }

    componentWillUnmount() {
        this.removeListeners(this.state);
    }

    // Listen for compleated todo amount change
    addTodoCompleatedAmountListener = ({ todoRef, currentUser, day }) => {
        if (moment(day).isSame(getDayOnlyTimestamp(moment()))) {
            todoRef.child(`${currentUser.uid}/`).on("child_changed", () => {
                this.getCompletionStatus(this.state);
            });
        }
    };

    removeListeners = ({ todoRef, currentUser }) => {
        todoRef.child(`${currentUser.uid}`).off();
    };

    // Set how many todos are compleated
    // Determine if day is done or not
    getCompletionStatus = ({ todoRef, currentUser, day }) => {
        todoRef
            .child(`${currentUser.uid}/${day.valueOf()}/count/`)
            .on("value", counts => {
                this.setDayCompletionAmount(counts);

                // If there are todos, set day finished status
                // Else mark days as done
                if (counts.exists()) {
                    if (counts.val().total === counts.val().totalChecked) {
                        this.setDayAsDone();
                    } else {
                        this.setDayAsNotDone();
                    }
                } else this.setDayAsDone();
            });
    };

    // Set how many todos are compleated in the day
    setDayCompletionAmount = counts => {
        if (counts.exists()) {
            // Get how many todos are compleated
            let compleatedTodosAmount = `${counts.val().totalChecked}/${
                counts.val().total
            }`;

            this.setState({ compleatedAmount: compleatedTodosAmount });
        } else {
            this.setState({ compleatedAmount: "0/0" });
        }
    };

    setDayAsDone = () => {
        this.setState({
            iconStatus: "checkmark"
        });
    };

    setDayAsNotDone = () => {
        this.setState({
            iconStatus: "delete"
        });
    };

    render() {
        const { day, iconStatus, compleatedAmount } = this.state;

        return (
            <Grid.Row
                as={Link}
                to={`/planner/${formatMoment(day, "DD/MM/YYYY")}`}
                key={formatMoment(day, "DD/MM/YYYY")}
                onClick={() => this.props.setCurrentDay(day)}
                className="days-list-item"
            >
                <Grid.Column
                    floated="left"
                    width={10}
                    className="days-list-item-date"
                >
                    {formatMoment(day, "DD/MM/YYYY - ddd")}
                </Grid.Column>
                <Grid.Column floated="right" width={3} className="count-column">
                    <span className="todo-count">{compleatedAmount}</span>
                </Grid.Column>
                <Grid.Column floated="right" width={3} className="icon-column">
                    <span className="icon-box">
                        <Icon
                            className="days-list-item-icon"
                            name={iconStatus}
                        />
                    </span>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

export default connect(
    null,
    { setCurrentDay }
)(DaysListItem);
