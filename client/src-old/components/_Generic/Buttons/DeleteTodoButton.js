// Object Imports
import React from "react";
import firebase from "../../../helpers/firebase/Auth";
import moment from "moment";
// Destructured Imports
import { connect } from "react-redux";
// Icon Imports
import DeleteIcon from "@material-ui/icons/Delete";
// Helper Imports
import { deleteTodoFromFirebase } from "../../../helpers/functions/Todo";
import { getDayOnlyTimestamp } from "../../../helpers/functions/Global";

class DeleteTodoButton extends React.Component {
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
            todo: props.todo,
            category: props.category,
            currentDay: props.currentDay
        };
    }

    // Check if todo is repeating, if so remove it from
    // each day, if not, remove its single instance
    handleTodoDeletion = ({
        todoRef,
        currentUser,
        currentDay,
        category,
        todo
    }) => {
        if (todo.isRepeating) {
            this.deleteRepeatingTodo(this.state);
        } else {
            deleteTodoFromFirebase(
                todoRef,
                currentUser,
                currentDay,
                category,
                todo
            );
        }
    };

    // Delete repeating todo from firebase in all days its active
    deleteRepeatingTodo = ({
        todoRef,
        currentUser,
        todo,
        generateUntillDate,
        category,
        currentDay
    }) => {
        for (
            let startDate = moment(currentDay);
            startDate.isBefore(moment(generateUntillDate).add(1, "day"));
            startDate.add(1, "days")
        ) {
            let dayTimestamp = getDayOnlyTimestamp(startDate);
            deleteTodoFromFirebase(
                todoRef,
                currentUser,
                dayTimestamp,
                category,
                todo
            );
        }
    };

    render() {
        return (
            <DeleteIcon onClick={() => this.handleTodoDeletion(this.state)} />
        );
    }
}

const mapStateToProps = state => ({
    currentDay: state.planner.currentDay,
    generateUntillDate: state.planner.generateUntillDate
});

export default connect(mapStateToProps, null)(DeleteTodoButton);
