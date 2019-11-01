// Object Imports
import React from "react";
import moment from "moment";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Icon } from "semantic-ui-react";
import { connect } from "react-redux";

class PushTodoToTomorrow extends React.Component {
    state = {
        todoRef: firebase.database().ref("todos"),
        currentUser: firebase.auth().currentUser,

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
    deleteTodoFromToday = ({ todoRef, currentUser, category, currentDay }) => {
        todoRef
            .child(`${currentUser.uid}/${currentDay}/categories/${category}/`)
            .remove()
            .catch(error => console.error(error));
    };

    render() {
        return (
            <Icon
                name="arrow circle down"
                onClick={this.handleTodoMove}
                link
                className="todo-card-icon"
            />
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay
});

export default connect(
    mapStateToProps,
    null
)(PushTodoToTomorrow);
