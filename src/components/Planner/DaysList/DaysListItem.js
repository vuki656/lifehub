// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Link } from "react-router-dom";
import { Icon, Grid } from "semantic-ui-react";
import { connect } from "react-redux";

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

    removeListeners = ({ todoRef, currentUser }) => {
        todoRef.child(`${currentUser.uid}`).off();
    };

    // Set how many todos are compleated
    // Determine if day is compleated or not
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

    // Determine weather to put a checkmark or an X
    setDayCompletionIcon = (total, checked) => {
        if (total) {
            if (checked === total) {
                this.setState({
                    iconStatus: "checkmark",
                    color: "#63ea90"
                });
            } else {
                this.setState({
                    iconStatus: "delete",
                    color: "#f12b2c"
                });
            }
        } else {
            this.setState({
                iconStatus: "checkmark",
                color: "#63ea90"
            });
        }
    };

    render() {
        const { color, day, iconStatus, compleatedAmount } = this.state;

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
                    <span
                        className="icon-box"
                        style={{ backgroundColor: color }}
                    >
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
