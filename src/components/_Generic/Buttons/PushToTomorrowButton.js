// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../../helpers/firebase/Auth";

// Destructured Imports
import { connect } from "react-redux";

// Icon Imports
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

class PushToTomorrowButton extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoRef: firebase.database().ref("todos"),

        // Props
        todo: this.props.todo,
        category: this.props.category,

        // Redux Props
        currentDay: this.props.currentDay
    };

    static getDerivedStateFromProps(props) {
        return {
            currentDay: props.currentDay
        };
    }

    // Handle todo move to next day
    handleTodoMove = () => {
        this.copyTodoToTomorrow(this.state);
        this.deleteTodoFromToday(this.state);
    };

    // Copy todo to next day
    copyTodoToTomorrow = ({ todoRef, currentUser, category, todo }) => {
        // Take selected day and add 1 day to it
        let tomorrowTimestamp = moment(this.state.currentDay)
            .add(1, "day")
            .valueOf();

        todoRef
            .child(
                `${currentUser.uid}/${tomorrowTimestamp}/categories/${category}/`
            )
            .update({ [todo.key]: todo })
            .catch(error => console.error(error));
    };

    // Remove todo from current day
    deleteTodoFromToday = ({
        todoRef,
        currentUser,
        category,
        currentDay,
        todo
    }) => {
        todoRef
            .child(
                `${currentUser.uid}/${currentDay}/categories/${category}/${todo.key}`
            )
            .remove()
            .catch(error => console.error(error));
    };

    render() {
        return <ExitToAppIcon onClick={this.handleTodoMove} />;
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(mapStateToProps, null)(PushToTomorrowButton);
