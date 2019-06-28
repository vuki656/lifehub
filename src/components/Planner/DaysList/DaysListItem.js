import React from "react";
import firebase from "../../../firebase/Auth";

import { Link } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { formatMoment } from "../../../helpers/Global";

class DaysListItem extends React.Component {
    state = {
        iconStatus: "",
        compleatedAmount: null,
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

        day: this.props.day
    };

    componentDidMount() {
        this.addTodoCompleatedAmountListener(this.state);
        this.getCompletionStatus(this.state);
    }

    // Listen for compleated todo amount change
    addTodoCompleatedAmountListener = ({ todoRef, currentUser }) => {
        todoRef.child(`${currentUser.uid}/`).on("child_changed", () => {
            this.getCompletionStatus(this.state);
        });
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
            this.setState({ compleatedAmount: "0/0 " });
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
            <Link
                to={`/planner/${formatMoment(day, "DD/MM/YYYY")}`}
                key={formatMoment(day, "DD/MM/YYYY")}
                onClick={() => this.props.setCurrentDay(day)}
            >
                <li>
                    {formatMoment(day, "DD/MM/YYYY - ddd")}
                    <Icon name={iconStatus} />
                    {compleatedAmount}
                </li>
            </Link>
        );
    }
}

export default DaysListItem;
