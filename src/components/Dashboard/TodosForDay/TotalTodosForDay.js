import React from "react";
import firebase from "../.././../firebase/Auth";
import moment from "moment";

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

    fetchTotalTodosForDay = ({ todoRef, currentUser, currentDay }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/count/`)
            .on("value", counts => {
                let totalTodos = counts.val().total;
                let totalCheckedTodos = counts.val().totalChecked;

                if (this._isMounted) {
                    this.setState({ totalTodos, totalCheckedTodos });
                }
            });
    };

    render() {
        const { totalTodos, totalCheckedTodos } = this.state;

        return `${totalCheckedTodos}/${totalTodos}`;
    }
}

export default TotalTodosForDay;
