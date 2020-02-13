// Object Imports
import React from "react";
import firebase from "../../firebase/Auth";
import moment from "moment";

// Icon Imports
import DeleteIcon from "@material-ui/icons/Delete";

// Helper Imports
import { getDayOnlyTimestamp } from "../../helpers/Global";

class DeleteTodoCardButton extends React.Component {
    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todosRef: firebase.database().ref("todos"),
        todoCardRef: firebase.database().ref("todo-cards"),

        // Base
        todayTimestamp: getDayOnlyTimestamp(moment()),

        // Props
        todoCard: this.props.todoCard
    };

    // Handle todo card deletion
    handleTodoCardDeletion = () => {
        this.deleteTodoCard(this.state);
        this.removeTodoCardTodos(this.state);
    };

    // Delete todo card in firebase
    deleteTodoCard = ({ todoCardRef, currentUser, todoCard }) => {
        todoCardRef
            .child(`${currentUser.uid}/${todoCard.key}`)
            .remove()
            .catch(err => console.error(err));
    };

    // Delete all todos that were under the deleted card
    removeTodoCardTodos = ({
        todosRef,
        currentUser,
        todayTimestamp,
        todoCard
    }) => {
        let endDate = this.getLastDayOfDaysList(this.state);

        for (
            let iteratingDate = moment(todayTimestamp);
            iteratingDate.isBefore(moment(endDate).add(1, "day"));
            iteratingDate.add(1, "days")
        ) {
            let dayStampOnly = getDayOnlyTimestamp(iteratingDate);
            todosRef
                .child(
                    `${currentUser.uid}/${dayStampOnly}/categories/${todoCard.key}`
                )
                .remove()
                .catch(err => console.error(err));
        }
    };

    // Get the last day timestamp in todos days list node
    getLastDayOfDaysList = ({ todosRef, currentUser }) => {
        todosRef
            .child(currentUser.uid)
            .limitToLast(1)
            .once("value", lastDay => {
                if (lastDay.val()) {
                    return lastDay.val().key;
                }
            });
    };

    render() {
        return <DeleteIcon onClick={this.handleTodoCardDeletion} />;
    }
}

export default DeleteTodoCardButton;
