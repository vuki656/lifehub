// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Typography } from "@material-ui/core";

class TodosForDayCount extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),

        // Base
        totalTodos: 0,
        totalCheckedTodos: 0,

        // Props
        day: this.props.day
    };

    componentDidMount() {
        this._isMounted = true;
        this.fetchTotalTodosForDay(this.state);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Fetch todo number for current day from firebase
    fetchTotalTodosForDay = ({ todoRef, currentUser, day }) => {
        let total = 0;
        let checked = 0;

        todoRef
            .child(`${currentUser.uid}/${day}/count/`)
            .on("value", countCategories => {
                if (countCategories.exists()) {
                    countCategories.forEach(countCategory => {
                        total = total + countCategory.val().total;
                        checked = checked + countCategory.val().checked;
                    });
                    this._isMounted &&
                        this.setState({
                            totalTodos: total,
                            totalCheckedTodos: checked
                        });
                } else {
                    this._isMounted &&
                        this.setState({ totalTodos: 0, totalCheckedTodos: 0 });
                }
            });
    };

    render() {
        const { totalTodos, totalCheckedTodos } = this.state;

        return (
            <Typography variant={"h4"}>
                Todos for today: {`${totalCheckedTodos}/${totalTodos}`}
            </Typography>
        );
    }
}

export default TodosForDayCount;
