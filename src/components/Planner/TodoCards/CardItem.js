// Other Imports
import React from "react";
import firebase from "../../../firebase/Auth";
// MUI Component Imports
import Grid from "@material-ui/core/Grid";
// Component Imports
import TodoList from "./CardTodoList";
import AddTodoInput from "./CardInput";
import { CardItemTopBar } from "./CardItemTopBar";

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
                    <CardItemTopBar todoCard={todoCard} />
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
