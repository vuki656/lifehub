// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Grid } from "@material-ui/core";

// Component Imports
import TodoList from "./TodoList/TodoList";
import EditTodoCardNameButton from "./Buttons/EditTodoCardNameButton";
import AddTodoInput from "./TodoList/AddTodoInput";
import DeleteTodoCardButton from "./Buttons/DeleteTodoCardButton";

class TodoCard extends React.Component {
    state = {
        currentUser: firebase.auth().currentUser,
        todoCardRef: firebase.database().ref("todo-cards"),

        // Props
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

    // Listen for todo card name changes
    addChangeTodoCardListener = ({ todoCardRef, currentUser, todoCard }) => {
        todoCardRef
            .child(`${currentUser.uid}/${todoCard.key}`)
            .on("child_changed", changedTodoCard => {
                this.setState({ name: changedTodoCard.val() });
            });
    };

    render() {
        const { todoCard, name } = this.state;

        return (
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-start"
            >
                <Grid item xs={12}>
                    {name}
                    <EditTodoCardNameButton todoCard={todoCard} />
                    <DeleteTodoCardButton todoCar={todoCard} />
                </Grid>
                <Grid item xs={12}>
                    <TodoList todoCard={todoCard} />
                </Grid>
                <Grid item xs={12}>
                    <AddTodoInput todoCard={todoCard} />
                </Grid>
            </Grid>
        );
    }
}

export default TodoCard;
