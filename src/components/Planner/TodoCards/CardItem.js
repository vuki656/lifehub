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

class CardItem extends React.Component {
    // Used to prevent setState calls after component umounts
    _isMounted = false;

    state = {
        // Firebase
        currentUser: firebase.auth().currentUser,
        todoCardRef: firebase.database().ref("todo-cards"),

        // Props
        todoCard: this.props.todoCard
    };

    componentDidMount() {
        this._isMounted = true;
        this.addChangeTodoCardListener(this.state);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Listen for todo card name changes and fetch changed db values from card
    addChangeTodoCardListener = ({ todoCardRef, currentUser, todoCard }) => {
        todoCardRef
            .child(`${currentUser.uid}/${todoCard.key}`)
            .on("child_changed", changedTodoCard => {
                this._isMounted &&
                    this.setState({
                        todoCard: {
                            ...todoCard,
                            name: changedTodoCard.val()
                        }
                    });
            });
    };

    render() {
        const { todoCard } = this.state;

        return (
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
            >
                <Grid item xs={12}>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item xs={10}>
                            {todoCard.name}
                        </Grid>
                        <Grid
                            item
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            xs={2}
                        >
                            <EditTodoCardNameButton todoCard={todoCard} />
                            <DeleteTodoCardButton todoCard={todoCard} />
                        </Grid>
                    </Grid>
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

export default CardItem;
