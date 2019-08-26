// Object Imports
import React from "react";
import firebase from "../.././../firebase/Auth";
import moment from "moment";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class TotalTodosForDay extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
        currentDay: getDayOnlyTimestamp(moment()),
        totalTodos: 0,
        totalCheckedTodos: 0
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchTotalTodosForDay(this.state);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchTotalTodosForDay = ({ todoRef, currentUser, currentDay }) => {
        let total = 0;
        let checked = 0;

        todoRef
            .child(`${currentUser.uid}/${currentDay}/count/`)
            .on("value", countCategories => {
                if (countCategories.exists()) {
                    countCategories.forEach(countCategory => {
                        total = total + countCategory.val().total;
                        checked = checked + countCategory.val().checked;
                    });
                    this.setState({
                        totalTodos: total,
                        totalCheckedTodos: checked
                    });
                } else {
                    this.setState({ totalTodos: 0, totalCheckedTodos: 0 });
                }
            });
    };

    render() {
        const { totalTodos, totalCheckedTodos } = this.state;

        return `${totalCheckedTodos}/${totalTodos}`;
    }
}

export default TotalTodosForDay;
