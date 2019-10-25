// Object Imports
import React from "react";
import firebase from "../../../../firebase/Auth";
import moment from "moment";

// Destructured Imports
import { Grid, Icon } from "semantic-ui-react";

// Component Imports
import TodoList from "./TodoList";
import EditTodoCardNamePopup from "../Popups/EditTodoCardNamePopup";
import AddTodoInput from "./AddTodoInput";

// Helper Imports
import { getDayOnlyTimestamp } from "../../../../helpers/Global";

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
        const { todoCard, name } = this.state;

        return (
            <Grid.Column stretched>
                <div className="todo-card">
                    <Grid className="todo-card-title">
                        <Grid.Row className="pad-top-bot-0">
                            <Grid.Column floated="left" width={11}>
                                {name}
                            </Grid.Column>
                            <Grid.Column floated="right" width={5}>
                                <EditTodoCardNamePopup todoCard={todoCard} />
                                <Icon
                                    name={"remove"}
                                    link={true}
                                    onClick={this.handleTodoCardDeletion}
                                    className="todo-card-icon"
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <div className="todo-card-todos">
                        <TodoList todoCard={todoCard} />
                    </div>
                    <Grid.Row>
                        <AddTodoInput todoCard={todoCard} />
                    </Grid.Row>
                </div>
            </Grid.Column>
        );
    }
}

export default TodoCard;
