// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";

class TodosForDayCount extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,
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

        return (
            <span className="total-todos-for-day-count">
                {`${totalCheckedTodos}/${totalTodos}`}
            </span>
        );
    }
}

export default TodosForDayCount;
