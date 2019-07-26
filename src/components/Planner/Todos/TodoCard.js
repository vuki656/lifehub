// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Grid, Icon } from "semantic-ui-react";

// Component Imports
import TodoList from "./TodoList";
import EditTodoCardNamePopup from "./Popups/EditTodoCardNamePopup";
import AddTodoSection from "./AddTodoSection";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../helpers/Global";

class TodoCard extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        todoCardRef: firebase.database().ref("todo-cards"),
        todosRef: firebase.database().ref("todos"),
        todayTimestamp: getDayOnlyTimestamp(moment()),

        name: this.props.todoCard.name,
        todoCard: this.props.todoCard
    };

    static getDerivedStateFromProps(props) {
        return {
            todoCard: props.todoCard
        };
    }

    componentDidMount() {
        this.addChangeTodoCardListener(this.state);
    }

    addChangeTodoCardListener = ({ todoCardRef, currentUser, todoCard }) => {
        todoCardRef
            .child(`${currentUser.uid}/${todoCard.key}`)
            .on("child_changed", changedTodoCard => {
                this.setState({ name: changedTodoCard.val() });
            });
    };

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
        let endDate = this.getLastDayWithTodos(this.state);

        for (
            let itteratingDate = moment(todayTimestamp);
            itteratingDate.isBefore(moment(endDate).add(1, "day"));
            itteratingDate.add(1, "days")
        ) {
            let dayStampOnly = getDayOnlyTimestamp(itteratingDate);
            todosRef
                .child(
                    `${currentUser.uid}/${dayStampOnly}/categories/${
                        todoCard.key
                    }`
                )
                .remove()
                .catch(err => console.error(err));
        }
    };

    getLastDayWithTodos = ({ todosRef, currentUser }) => {
        todosRef
            .child(currentUser.uid)
            .limitToLast(1)
            .once("value", lastDay => {
                return lastDay.val().key;
            });
    };

    render() {
        const { todoCard, name } = this.state;

        return (
            <Grid.Column>
                {name}
                <EditTodoCardNamePopup todoCard={todoCard} />
                <Icon
                    name={"remove"}
                    link={true}
                    onClick={this.handleTodoCardDeletion}
                />
                <TodoList todoCard={todoCard} />
                <Grid.Row>
                    <AddTodoSection todoCard={todoCard} />
                </Grid.Row>
            </Grid.Column>
        );
    }
}

export default TodoCard;
