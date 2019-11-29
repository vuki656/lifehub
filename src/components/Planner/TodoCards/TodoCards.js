// Object Imports
import React from "react";
import firebase from "../../../firebase/Auth";

// Destructured Imports
import { Grid } from "@material-ui/core";

// Component Imports
import TodoCardItem from "./TodoCardItem";
import AddTodoCardButton from "./Buttons/AddTodoCardButton";

class TodoCards extends React.Component {
    state = {
        todoCardRef: firebase.database().ref("todo-cards"),
        currentUser: firebase.auth().currentUser,
        isInPast: false,
        todoCards: []
    };

    componentDidMount() {
        this.addListeners();
        this.fetchTodoCards(this.state);
    }

    addListeners = () => {
        this.addTodoCardListener(this.state);
        this.addRemoveTodoCardListener(this.state);
    };

    // Listen for todo card additions
    addTodoCardListener = ({ currentUser, todoCardRef }) => {
        todoCardRef.child(currentUser.uid).on("child_added", () => {
            this.fetchTodoCards(this.state);
        });
    };

    // Listen for new todo card deletions
    addRemoveTodoCardListener = ({ currentUser, todoCardRef }) => {
        todoCardRef.child(currentUser.uid).on("child_removed", () => {
            this.fetchTodoCards(this.state);
        });
    };

    // Fetch todo cards from firebase
    fetchTodoCards = ({ todoCardRef, currentUser }) => {
        let todoCardHolder = [];

        todoCardRef.child(currentUser.uid).once("value", todoCards => {
            todoCards.forEach(todoCard => {
                todoCardHolder.push({
                    name: todoCard.val().name,
                    key: todoCard.val().key
                });
            });
            this.setState({ todoCards: todoCardHolder });
        });
    };

    // Render todo cards on the screen
    renderTodoCards = ({ todoCards }) =>
        todoCards.map(todoCard => (
            <Grid item xs={4} key={todoCard.key}>
                <TodoCardItem todoCard={todoCard} />
            </Grid>
        ));

    render() {
        return (
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={2}
            >
                {this.renderTodoCards(this.state)}
                <Grid item xs={4}>
                    <AddTodoCardButton />
                </Grid>
            </Grid>
        );
    }
}

export default TodoCards;
