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
        totalTodos: null,
        totalCheckedTodos: null
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchTotalTodosForDay(this.state);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchTotalTodosForDay = ({ todoRef, currentUser, currentDay }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/count/`)
            .on("value", counts => {
                if (counts.val()) {
                    let totalTodos = counts.val().total;
                    let totalCheckedTodos = counts.val().totalChecked;

                    if (this._isMounted) {
                        this.setState({ totalTodos, totalCheckedTodos });
                    }
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
